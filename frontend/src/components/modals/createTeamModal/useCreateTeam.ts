import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "../../../api/axios";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllUsers } from '../../../store/slices/authSlice';
import { User } from "../../../types";

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
            await api.post("/teams", {
                name: teamName,
                memberIds: selectedMembers,
            });

            setSuccess(true);

            // Close modal after short delay to show success
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setTeamName("");
                setSelectedMembers([]);
            }, 1500);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || "Failed to create team");
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
