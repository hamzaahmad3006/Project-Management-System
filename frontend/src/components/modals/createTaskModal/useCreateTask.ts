import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createTask } from '../../../store/slices/taskSlice';
import { fetchProjects } from '../../../store/slices/projectSlice';
import { TeamMember, TaskStatus, TaskPriority } from "../../../types";

export const useCreateTask = (onClose: () => void, initialStatus?: TaskStatus) => {
    const dispatch = useAppDispatch();
    const projects = useAppSelector(state => state.projects.projects);
    const currentUser = useAppSelector(state => state.auth.user);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(initialStatus || 'TODO');

    // Update status if initialStatus changes (modal reopened with different column)
    useEffect(() => {
        if (initialStatus) {
            setStatus(initialStatus);
        }
    }, [initialStatus]);
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [budget, setBudget] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Set default project
    useEffect(() => {
        if (projects.length > 0 && !projectId) {
            setProjectId(projects[0].id);
        }
    }, [projects, projectId]);

    // Extract team members when project changes
    useEffect(() => {
        if (!projectId || projects.length === 0) {
            setTeamMembers([]);
            return;
        }

        const project = projects.find(p => p.id === projectId);
        if (project?.team?.members) {
            const members = project.team.members.map((m: { user: { id: string, name: string } }) => ({
                id: m.user.id,
                name: m.user.name
            }));
            setTeamMembers(members);
        } else {
            setTeamMembers([]);
        }
    }, [projectId, projects]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) {
            alert("Please select a project");
            return;
        }

        setIsLoading(true);
        console.log("Submitting Task with Labels:", labels); // DEBUG LOG
        try {
            await dispatch(createTask({
                name,
                description,
                status,
                priority,
                dueDate: dueDate || null,
                assigneeId: assigneeId || undefined,
                projectId,
                budget,
                label: labels // Pass labels to the backend
            })).unwrap();

            onClose();
            // Reset form
            setName('');
            setDescription('');
            setAssigneeId('');
            setDueDate('');
            setPriority('MEDIUM');
            setStatus('TODO');
            setBudget(0);
            setLabels([]);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            window.toastify(err.response?.data?.message || "Failed to create task", "error");
        } finally {
            setIsLoading(false);
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
        budget,
        setBudget,
        labels,
        setLabels,
        isLoading,
        teamMembers,
        handleSubmit
    };
};
