import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, createTask as createTaskAction, updateTask, updateTaskStatusOptimistic } from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { Task, Section, TaskStatus } from '../../types';

export const useProjectBoard = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector(state => state.tasks);
    const { projects, currentProject: stateCurrentProject, selectedProjectId } = useAppSelector(state => state.projects);

    const [activeView, setActiveView] = useState('Board');
    const [collapsedSections, setCollapsedSections] = useState<string[]>(['postpone', 'qa']);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Derive the current project based on global selection
    const currentProject = useMemo(() => {
        if (selectedProjectId && selectedProjectId !== 'all') {
            return projects.find(p => p.id === selectedProjectId) || stateCurrentProject;
        }
        return stateCurrentProject || (projects.length > 0 ? projects[0] : null);
    }, [projects, selectedProjectId, stateCurrentProject]);

    useEffect(() => {
        // Fetch projects if not already loaded
        if (projects.length === 0) {
            dispatch(fetchProjects());
        }

        // Use global selectedProjectId if set, otherwise fallback to currentProject
        const projectIdToFetch = (selectedProjectId && selectedProjectId !== 'all')
            ? selectedProjectId
            : currentProject?.id;

        dispatch(fetchTasks(projectIdToFetch ? { projectId: projectIdToFetch } : {}));
    }, [dispatch, currentProject?.id, selectedProjectId]); // Note: excluding projects.length to avoid loops, only fetch once if empty

    const handleAddTask = (taskName: string, sectionId: string) => {
        const activeProjectId = (selectedProjectId && selectedProjectId !== 'all')
            ? selectedProjectId
            : currentProject?.id;

        if (!activeProjectId) {
            window.toastify("Please select a project first", "error");
            return;
        }

        const newTaskData = {
            name: taskName,
            status: 'TODO' as const,
            priority: 'MEDIUM' as const,
            sectionId: sectionId,
            projectId: activeProjectId,
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

    const [currentDate, setCurrentDate] = useState(new Date());

    // Transform raw tasks into calendar events (Assign Date -> Green, Due Date -> Red)
    const calendarEvents = useMemo(() => {
        return tasks.flatMap(t => {
            const events = [];
            const dueDate = t.dueDate ? new Date(t.dueDate) : null;
            const assignDate = t.createdAt ? new Date(t.createdAt) : null;
            const projectName = t.project?.name || 'No Project';

            // 1. Assign Date Event (Green Badge)
            if (assignDate) {
                events.push({
                    id: `${t.id}-assign`,
                    title: projectName,
                    taskName: t.name,
                    date: assignDate.getUTCDate(),
                    month: assignDate.getUTCMonth(),
                    year: assignDate.getUTCFullYear(),
                    type: 'assign',
                    color: 'bg-green-600 text-white',
                    task: t
                });
            }

            // 2. Due Date Event (Red Badge)
            if (dueDate) {
                events.push({
                    id: `${t.id}-due`,
                    title: projectName,
                    taskName: t.name,
                    date: dueDate.getUTCDate(),
                    month: dueDate.getUTCMonth(),
                    year: dueDate.getUTCFullYear(),
                    type: 'due',
                    color: 'bg-red-600 text-white',
                    task: t
                });
            }

            return events;
        });
    }, [tasks]);

    // Helper to generate calendar grid
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6 (Sun-Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        // Adjust Sun=0 to Mon=0 for Mon-Sun grid
        const offset = (firstDayOfMonth + 6) % 7;

        return Array.from({ length: 42 }).map((_, i) => {
            const date = new Date(year, month, i - offset + 1);
            return {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                isCurrentMonth: date.getMonth() === month
            };
        });
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };

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
        sections: dynamicSections,
        calendarEvents,
        currentDate,
        calendarDays,
        handlePrevMonth,
        handleNextMonth,
        handleGoToToday,
        currentProject
    };
};
