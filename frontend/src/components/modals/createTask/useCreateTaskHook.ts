import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createTask } from '../../../store/slices/taskSlice';
import { fetchProjects } from '../../../store/slices/projectSlice';
import { TaskPriority, TaskStatus } from '../../../types';

export const useCreateTaskHook = (isOpen: boolean, onClose: () => void, initialStatus?: TaskStatus, initialProjectId?: string) => {
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state) => state.projects);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(initialStatus || 'TODO');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState(initialProjectId || '');
    const [sectionId, setSectionId] = useState('');
    const [files, setFiles] = useState<File[]>([]);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setStatus('TODO');
        setPriority('MEDIUM');
        setDueDate('');
        setAssigneeId('');
        setProjectId('');
        setSectionId('');
        setFiles([]);
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
                label: labels
            })).unwrap();

            window.toastify("Task created successfully", "success");
            onClose();
            resetForm();
        } catch (err: any) {
            window.toastify(err || "Failed to create task", "error");
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
        files,
        setFiles,
        labels,
        setLabels,
        loading,
        handleFileChange,
        handleSubmit,
        resetForm
    };
};
