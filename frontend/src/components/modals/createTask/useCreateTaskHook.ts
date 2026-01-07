import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createTask } from '../../../store/slices/taskSlice';
import { fetchProjects } from '../../../store/slices/projectSlice';
import { AxiosError } from 'axios';
import { TaskPriority, TaskStatus } from 'types';

export const useCreateTaskHook = (isOpen: boolean, onClose: () => void, initialStatus?: TaskStatus, initialProjectId?: string) => {
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state) => state.projects);


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(initialStatus || 'TODO');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState(initialProjectId || '');
    const [sectionId, setSectionId] = useState('');
    const [budget, setBudget] = useState('');
    const [labels, setLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchProjects());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (initialStatus) {
            setStatus(initialStatus);
        }
    }, [initialStatus]);

    useEffect(() => {
        if (initialProjectId) {
            setProjectId(initialProjectId);
        }
    }, [initialProjectId]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setStatus('TODO');
        setPriority('MEDIUM');
        setDueDate('');
        setAssigneeId('');
        setProjectId('');
        setSectionId('');
        setBudget('');
        setLabels([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId) {
            window.toastify("Please select a project", "error");
            return;
        }

        if (!name.trim()) {
            window.toastify("Task name is required", "error");
            return;
        }

        setLoading(true);
        try {
            await dispatch(createTask({
                name,
                description,
                status,
                priority,
                dueDate: dueDate || undefined,
                projectId,
                assigneeId: assigneeId || undefined,
                label: labels,
                budget: budget ? Number(budget) : undefined
            })).unwrap();

            window.toastify("Task created successfully", "success");
            onClose();
            resetForm();
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            window.toastify(error.response?.data?.message || "Failed to create task", "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        projects,
        name,
        setName,
        description,
        setDescription,
        status,
        setStatus,
        priority,
        setPriority,
        dueDate,
        setDueDate,
        assigneeId,
        setAssigneeId,
        projectId,
        setProjectId,
        sectionId,
        setSectionId,
        budget,
        setBudget,
        labels,
        setLabels,
        loading,
        handleSubmit,
        resetForm
    };
};
