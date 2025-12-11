import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllUsers } from "../../store/slices/authSlice";
import api from "../../api/axios";

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: "MEMBER" | "MANAGER";
    avatar?: string;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const allUsers: User[] = useAppSelector((state) => state.auth.allUsers || []);

    const [teamName, setTeamName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchAllUsers());
            // Reset form when modal opens
            setTeamName("");
            setSelectedMembers([]);
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, dispatch]);

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
            }, 1500);
        } catch (err: any) {
            console.error("Create team error:", err);
            setError(err.response?.data?.message || "Failed to create team");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Create new team</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            Team created successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Team Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Team name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            disabled={loading}
                        />
                    </div>

                    {/* Members List */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Select Members <span className="text-red-500">*</span>
                            {selectedMembers.length > 0 && (
                                <span className="ml-2 text-xs text-blue-600">
                                    ({selectedMembers.length} selected)
                                </span>
                            )}
                        </label>
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                            {allUsers.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">Loading users...</p>
                            ) : (
                                allUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => !loading && toggleMember(user.id)}
                                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedMembers.includes(user.id)
                                            ? "bg-blue-100 border border-blue-300"
                                            : "hover:bg-gray-50"
                                            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={user.avatar || "https://via.placeholder.com/40"}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                                {selectedMembers.includes(user.id) && (
                                                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {user.role}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            onClick={handleCreateTeam}
                            disabled={loading || !teamName.trim() || selectedMembers.length === 0}
                            className={`px-5 py-2 text-white text-sm font-medium rounded transition-colors shadow-sm ${loading || !teamName.trim() || selectedMembers.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {loading ? "Creating..." : "Create Team"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;
