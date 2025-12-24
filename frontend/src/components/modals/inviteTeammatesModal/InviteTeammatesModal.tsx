import React from 'react';
import { FaTimes, FaEnvelope, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { CreateModalProps } from '../../../types';
import { useInviteTeammates } from './useInviteTeammates';
import { ButtonLoader } from '../../../components/loader/Loader';

const InviteTeammatesModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const {
        emailInput,
        setEmailInput,
        selectedTeam,
        setSelectedTeam,
        selectedRole,
        setSelectedRole,
        personalMessage,
        setPersonalMessage,
        loading,
        teams,
        handleSend
    } = useInviteTeammates(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1c23] rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up border border-transparent dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Invite Teammates</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email addresses</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="name@company.com, name2@company.com"
                                className="w-full pl-9 pr-3 py-2 border border-blue-400 dark:border-blue-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                                autoFocus
                                disabled={loading}
                            />
                            <FaEnvelope size={14} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple emails with commas.</p>
                    </div>

                    {/* Team & Role Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Team */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add to team</label>
                            <div className="relative">
                                <select
                                    value={selectedTeam}
                                    onChange={(e) => setSelectedTeam(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                                    disabled={loading}
                                >
                                    {teams.length === 0 ? (
                                        <option value="">No teams found</option>
                                    ) : (
                                        teams.map(t => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))
                                    )}
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                                    disabled={loading}
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="MANAGER">Manager</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal message (optional)</label>
                        <textarea
                            rows={3}
                            value={personalMessage}
                            onChange={(e) => setPersonalMessage(e.target.value)}
                            placeholder="Join us to collaborate on..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none"
                            disabled={loading}
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
                        >
                            {loading ? <ButtonLoader /> : 'Send Invites'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#12141c] border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Read more about <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">roles and permissions</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InviteTeammatesModal;
