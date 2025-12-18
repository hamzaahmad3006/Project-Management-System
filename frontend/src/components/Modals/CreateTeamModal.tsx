import React from "react";
import { FaTimes } from "react-icons/fa";
import { CreateModalProps, User } from "../../types";
import { useCreateTeam } from "../../utils/Hooks/ModalHooks";


const CreateTeamModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const {
        allUsers,
        teamName,
        setTeamName,
        selectedMembers,
        loading,
        error,
        success,
        toggleMember,
        handleCreateTeam
    } = useCreateTeam(onClose);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden border border-transparent dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Create new team</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        disabled={loading}
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm">
                            Team created successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Team Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Team name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-shadow"
                            disabled={loading}
                        />
                    </div>

                    {/* Members List */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Select Members <span className="text-red-500">*</span>
                            {selectedMembers.length > 0 && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                    ({selectedMembers.length} selected)
                                </span>
                            )}
                        </label>
                        <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2 space-y-1 custom-scrollbar">
                            {allUsers.length === 0 ? (
                                <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">Loading users...</p>
                            ) : (
                                allUsers.map((user: User) => {
                                    const isAlreadyInTeam = user.teamMemberships && user.teamMemberships.length > 0;
                                    const isSelected = selectedMembers.includes(user.id);
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => !loading && !isAlreadyInTeam && toggleMember(user.id)}
                                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${isSelected
                                                ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700"
                                                : isAlreadyInTeam
                                                    ? "opacity-50 bg-gray-100 dark:bg-gray-800 cursor-not-allowed border border-transparent"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                                                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={user.avatar || "https://via.placeholder.com/40"}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                            ✓
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="truncate max-w-[200px]">
                                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                                        <span className="truncate">{user.name}</span>
                                                        {isAlreadyInTeam && (
                                                            <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                                Already in team
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {user.role}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={handleCreateTeam}
                            disabled={loading || !teamName.trim() || selectedMembers.length === 0}
                            className={`px-5 py-2 text-white text-sm font-medium rounded transition-colors shadow-sm ${loading || !teamName.trim() || selectedMembers.length === 0
                                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {loading ? "Creating..." : "Create Team"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
