import { useState, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { setCurrentProject, fetchProjects } from '../../../store/slices/projectSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';

export const useSearch = (isOpen: boolean, onClose: () => void) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { tasks, loading: tasksLoading } = useAppSelector((state) => state.tasks);
    const { projects, loading: projectsLoading } = useAppSelector((state) => state.projects);
    const [searchTerm, setSearchTerm] = useState('');

    const isLoading = tasksLoading || projectsLoading;

    // Fetch data if missing or stale when modal opens
    useEffect(() => {
        if (isOpen) {
            // Re-fetch to ensure we have latest data
            dispatch(fetchTasks({}));
            dispatch(fetchProjects());
        }
    }, [isOpen, dispatch]);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Reset search term when modal closes
    useEffect(() => {
        if (!isOpen) setSearchTerm('');
    }, [isOpen]);

    const searchResults = useMemo(() => {
        const safeTasks = Array.isArray(tasks) ? tasks : [];
        const safeProjects = Array.isArray(projects) ? projects : [];

        if (!searchTerm.trim()) return [];

        const normalizedTerm = searchTerm.toLowerCase().trim();

        const filteredProjects = safeProjects.filter(p =>
            (p.name && p.name.toLowerCase().includes(normalizedTerm)) ||
            (p.description && p.description.toLowerCase().includes(normalizedTerm))
        ).map(p => ({
            id: p.id,
            title: p.name,
            subtitle: 'Project',
            type: 'project' as const,
            date: p.status,
            avatar: p.team?.members?.[0]?.user?.avatar,
            original: p
        }));

        const filteredTasks = safeTasks.filter(t =>
            (t.name && t.name.toLowerCase().includes(normalizedTerm)) ||
            (t.description && t.description.toLowerCase().includes(normalizedTerm))
        ).map(t => ({
            id: t.id,
            title: t.name,
            subtitle: t.project?.name || 'Task',
            type: 'task' as const,
            date: t.status,
            avatar: t.assignedTo?.avatar,
            original: t
        }));

        return [...filteredProjects, ...filteredTasks];
    }, [searchTerm, tasks, projects]);

    const handleSelect = (item: any) => {
        if (item.type === 'project') {
            dispatch(setCurrentProject(item.original));
            navigate('/dashboard/board');
        } else {
            const project = projects.find(p => p.id === item.original.projectId);
            if (project) {
                dispatch(setCurrentProject(project));
                navigate('/dashboard/board');
            } else if (item.original.id) {
                navigate('/dashboard/tasks');
            }
        }
        onClose();
    };

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        isLoading,
        handleSelect
    };
};
