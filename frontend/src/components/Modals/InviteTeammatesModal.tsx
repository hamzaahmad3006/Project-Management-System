import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { CreateModalProps } from '../../types';


const InviteTeammatesModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Invite Teammates</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Email addresses</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="name@company.com, name2@company.com"
                                className="w-full pl-9 pr-3 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                                autoFocus
                            />
                            <FaEnvelope size={14} className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas.</p>
                    </div>

                    {/* Team & Role Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Team */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Add to team</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white text-sm text-gray-700">
                                    <option>Design team</option>
                                    <option>Development team</option>
                                    <option>Marketing team</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 bg-white text-sm text-gray-700">
                                    <option>Member</option>
                                    <option>Admin</option>
                                    <option>Guest</option>
                                </select>
                                <FaChevronDown size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Personal message (optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Join us to collaborate on..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none text-sm"
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm">
                            Send Invites
                        </button>
                        <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-500">
                        Read more about <a href="#" className="text-blue-500 hover:underline">roles and permissions</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InviteTeammatesModal;
