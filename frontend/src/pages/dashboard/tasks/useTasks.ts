import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchTasks, updateTask, updateTaskStatusOptimistic } from '../../../store/slices/taskSlice';
import { TaskStatus, Task } from 'types';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';


export const useTasks = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const { selectedProjectId } = useAppSelector((state) => state.projects);

    const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredTasks = useMemo(() => {
        if (!searchTerm.trim()) return tasks;
        const term = searchTerm.toLowerCase();
        return tasks.filter((t: Task) =>
            t.name.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term))
        );
    }, [tasks, searchTerm]);

    useEffect(() => {
        const filters: { projectId?: string } = {};
        if (selectedProjectId && selectedProjectId !== 'all') {
            filters.projectId = selectedProjectId;
        }
        dispatch(fetchTasks(filters));
    }, [dispatch, selectedProjectId]);

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as TaskStatus;

        dispatch(updateTaskStatusOptimistic({ id: draggableId, status: newStatus }));

        try {
            await dispatch(updateTask({ id: draggableId, data: { status: newStatus } })).unwrap();
            window.toastify(`Task moved to ${newStatus.toLowerCase().replace('_', ' ')}`, "success");
        } catch (err: unknown) {

            const error = err as AxiosError<{ message: string }>;
            dispatch(fetchTasks({}));
            window.toastify(error.response?.data?.message || "Failed to move task", "error");
        }
    };

    const columns = [
        { id: 'TODO', title: 'To-Do', color: 'bg-blue-500', items: filteredTasks.filter((t: Task) => t.status === 'TODO' || !t.status) },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-orange-500', items: filteredTasks.filter((t: Task) => t.status === 'IN_PROGRESS') },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500', items: filteredTasks.filter((t: Task) => t.status === 'COMPLETED') },
        { id: 'CANCELED', title: 'Cancelled', color: 'bg-red-500', items: filteredTasks.filter((t: Task) => t.status === 'CANCELED') },
    ];

    return {
        tasks,
        loading,
        viewMode,
        isCreateModalOpen,
        searchTerm,
        filteredTasks,
        columns,
        handleDragEnd,
        setViewMode,
        setIsCreateModalOpen,
        setSearchTerm,
        selectedTask,
        setSelectedTask,
        DragDropContext, Droppable, Draggable,
    }
}