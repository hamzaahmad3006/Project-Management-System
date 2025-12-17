import axios from "axios";
import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProject } from '../../store/slices/projectSlice';
import { getTeams } from '../../store/slices/teamSlice';
import { createTask } from '../../store/slices/taskSlice';
import { fetchAllUsers } from '../../store/slices/authSlice';
import { UserProfile } from "../../types";
import { fetchProjects } from '../../store/slices/projectSlice';
import { TeamMember, User } from '../../types';


export const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<UserProfile>>
) => {
    const { name, value } = e.target;
    setState((prev: UserProfile) => ({
        ...prev,
        [name]: value,
    }));
};

// settingModal Profile Picture 
export const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
};


// settingModal Profile Update Function 

export const handleChangeProfile = async (
    profile: UserProfile,
    file: File | null,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        setLoading(true);
        let avatarUrl = profile.avatar;

        // Upload file to Cloudinary if exists
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default"); // User confirmed default or didn't change

            const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;

            if (!cloudinaryUrl) {
                throw new Error("REACT_APP_CLOUDINARY_URL is not defined");
            }

            const res = await axios.post(cloudinaryUrl, formData);

            avatarUrl = res.data.secure_url;
        }


        const saveRes = await api.put("/auth/profile",
            { name: profile.name, avatar: avatarUrl },)

        const result = saveRes.data;

        setProfile((prev) => ({ ...prev, avatar: result.avatar || avatarUrl }));
        window.toastify("Profile updated!", "success");

    } catch (err) {
        console.error(err);
        window.toastify("Profile update failed!", "error");
    } finally {
        setLoading(false);
    }
};

//======= CreateProjectModal Hook ========
export const useCreateProject = (onClose: () => void) => {
    const dispatch = useAppDispatch();
    const { allTeams } = useAppSelector((state) => state.team);

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teamId, setTeamId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(getTeams());
    }, [dispatch]);

    const handleTemplateSelect = (template: string) => {
        setSelectedTemplate(template);
        setIsGalleryOpen(false);
    };

    const handleCreate = async () => {
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            await dispatch(createProject({
                name,
                description,
                budget: 0,
                teamId: teamId || undefined
            })).unwrap();

            // Reset
            setName('');
            setDescription('');
            setTeamId('');
            onClose();
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsLoading(false);
            window.toastify('Project created successfully', 'success');
        }
    };

    return {
        allTeams,
        isGalleryOpen,
        setIsGalleryOpen,
        selectedTemplate,
        handleTemplateSelect,
        name,
        setName,
        description,
        setDescription,
        teamId,
        setTeamId,
        isLoading,
        handleCreate
    };
};

//======= CreateTaskModal Hook =======

export const useCreateTask = (onClose: () => void) => {
    const dispatch = useAppDispatch();
    const projects = useAppSelector(state => state.projects.projects);
    const currentUser = useAppSelector(state => state.auth.user);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('TODO');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Set default project
    useEffect(() => {
        if (projects.length > 0 && !projectId) {
            setProjectId(projects[0].id);
        }
    }, [projects, projectId]);

    // Fetch team members when project changes
    useEffect(() => {
        const fetchTeamMembers = async () => {
            if (!projectId) return;

            try {
                const response = await api.get('/auth/all-users');
                setTeamMembers(response.data.users || response.data);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
                if (currentUser) {
                    setTeamMembers([{ id: currentUser.id, name: currentUser.name }]);
                }
            }
        };

        fetchTeamMembers();
    }, [projectId, currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) {
            alert("Please select a project");
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(createTask({
                name,
                description,
                status,
                priority,
                dueDate: dueDate || undefined,
                assigneeId: assigneeId || undefined,
                projectId,
            })).unwrap();

            onClose();
            // Reset form
            setName('');
            setDescription('');
            setAssigneeId('');
            setDueDate('');
            setPriority('MEDIUM');
            setStatus('TODO');
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Failed to create task. Please try again.");
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
        isLoading,
        teamMembers,
        handleSubmit
    };
};

//======= CreateTeamModal Hook =======

export const useCreateTeam = (onClose: () => void) => {
    const dispatch = useAppDispatch();
    const allUsers: User[] = useAppSelector((state) => state.auth.allUsers || []);

    const [teamName, setTeamName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const toggleMember = (userId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateTeam = async () => {
        // Validation
        if (!teamName.trim()) {
            setError("Team name is required");
            return;
        }

        if (selectedMembers.length === 0) {
            setError("Please select at least one member");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/teams", {
                name: teamName,
                memberIds: selectedMembers,
            });

            console.log("Team created successfully:", response.data);
            setSuccess(true);

            // Close modal after short delay to show success
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setTeamName("");
                setSelectedMembers([]);
            }, 1500);
        } catch (err: unknown) {
            console.error("Create team error:", err);
            setError("Failed to create team");
        } finally {
            setLoading(false);
        }
    };

    return {
        allUsers,
        teamName,
        setTeamName,
        selectedMembers,
        loading,
        error,
        success,
        toggleMember,
        handleCreateTeam
    };
};
