import React from 'react';
import { FaTimes, FaUsers, FaCheck, FaSpinner } from 'react-icons/fa';
import { CreateModalProps } from '../../../types';
import { useCreateTeam } from './useCreateTeam';
import { ButtonLoader } from 'components/loader/Loader';


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up border border-transparent dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Create new team</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-sm rounded-md flex items-center gap-2">
                            <FaCheck /> Team created successfully!
                        </div>
                    )}

                    {/* Team Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. Frontend Team"
                                className="w-full pl-9 pr-3 py-2 border border-blue-400 dark:border-blue-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                                autoFocus
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                disabled={loading || success}
                            />
                            <FaUsers size={14} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>

                    {/* Member Selection */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select members ({selectedMembers.length})
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-1 space-y-1 custom-scrollbar bg-gray-50/30 dark:bg-gray-900/10">
                            {allUsers.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">No users found</div>
                            ) : (
                                allUsers.map((user) => {
                                    const isInATeam = user.teamMemberships && user.teamMemberships.length > 0;
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => !isInATeam && toggleMember(user.id)}
                                            className={`flex items-center gap-3 p-2 rounded transition-colors ${isInATeam
                                                ? 'opacity-50 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/20'
                                                : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                                                } ${selectedMembers.includes(user.id)
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800'
                                                    : ''
                                                }`}
                                        >
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                                                    {isInATeam && (
                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                            <FaUsers size={10} /> {user.teamMemberships![0].team.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            {selectedMembers.includes(user.id) && (
                                                <FaCheck className="text-blue-500" size={12} />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleCreateTeam}
                            disabled={loading || success || !teamName.trim() || selectedMembers.length === 0}
                            className="flex-1 px-5 py-2.5 bg-blue-500 text-white text-sm font-bold rounded hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <ButtonLoader /> : 'Create team'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#12141c] border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Teams allow you to share projects and tasks with specific groups of people.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;
