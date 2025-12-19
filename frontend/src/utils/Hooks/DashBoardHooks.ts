import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, createTask as createTaskAction, updateTask, updateTaskStatusOptimistic } from '../../store/slices/taskSlice';
import { Task, Section, TaskStatus } from '../../types';

export const useProjectBoard = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector(state => state.tasks);
    const { currentProject } = useAppSelector(state => state.projects);

    const [activeView, setActiveView] = useState('Board');
    const [collapsedSections, setCollapsedSections] = useState<string[]>(['postpone', 'qa']);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        // Fetch tasks for the current project if available, otherwise fetch all
        dispatch(fetchTasks(currentProject ? { projectId: currentProject.id } : {}));
    }, [dispatch, currentProject?.id]);

    const handleAddTask = (taskName: string, sectionId: string) => {
        if (!currentProject) {
            window.toastify("Please select a project first", "error");
            return;
        }

        const newTaskData = {
            name: taskName,
            status: 'TODO' as const,
            priority: 'MEDIUM' as const,
            sectionId: sectionId,
            projectId: currentProject.id,
        };
        dispatch(createTaskAction(newTaskData));
    };

    const handleDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Map section IDs to TaskStatus
        const statusMap: Record<string, TaskStatus> = {
            'backlog': 'TODO',
            'inprogress': 'IN_PROGRESS',
            'qa': 'COMPLETED',
            'postpone': 'CANCELED'
        };

        const newStatus = statusMap[destination.droppableId];
        if (!newStatus) return;

        // Optimistic UI Update: Update status in Redux immediately
        dispatch(updateTaskStatusOptimistic({ id: draggableId, status: newStatus }));

        try {
            await dispatch(updateTask({
                id: draggableId,
                data: { status: newStatus }
            })).unwrap();
            window.toastify(`Task moved to ${destination.droppableId}`, "success");
        } catch (err: any) {
            // Revert on failure: Re-fetching tasks is the safest way to sync
            dispatch(fetchTasks(currentProject ? { projectId: currentProject.id } : {}));
            window.toastify(err || "Failed to move task", "error");
        }
    };

    const toggleSection = (sectionId: string) => {
        setCollapsedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Transform raw tasks into grouped sections for the UI
    const dynamicSections = useMemo((): Section[] => {
        // Fallback to empty tasks if none exist
        const backlogTasks = tasks.filter(t => t.status === 'TODO');
        const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
        const qaTasks = tasks.filter(t => t.status === 'COMPLETED'); // Mapping COMPLETED to QA for now as per user preference
        const canceledTasks = tasks.filter(t => t.status === 'CANCELED');

        return [
            {
                id: 'backlog',
                title: 'Backlog',
                count: backlogTasks.length,
                color: 'gray',
                tasks: backlogTasks
            },
            {
                id: 'postpone',
                title: 'Postpone',
                count: canceledTasks.length, // Mapping CANCELED to Postpone
                color: 'red',
                tasks: canceledTasks
            },
            {
                id: 'inprogress',
                title: 'In progress',
                count: inProgressTasks.length,
                color: 'green',
                tasks: inProgressTasks
            },
            {
                id: 'qa',
                title: 'QA',
                count: qaTasks.length,
                color: 'orange',
                tasks: qaTasks
            }
        ];
    }, [tasks]);

    return {
        tasks,
        loading,
        error,
        activeView,
        setActiveView,
        collapsedSections,
        toggleSection,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedTask,
        setSelectedTask,
        handleAddTask,
        handleDragEnd,
        sections: dynamicSections
    };
};
