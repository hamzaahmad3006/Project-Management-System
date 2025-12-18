import React from 'react';
import { FaTimes, FaUser, FaRegFlag, FaCalendarAlt, FaLayerGroup } from 'react-icons/fa';
import { CreateModalProps } from '../../types';
import { useCreateTask } from '../../utils/Hooks/ModalHooks';


const CreateTaskModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const {
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
    } = useCreateTask(onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fade-in-up border border-transparent dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Add New Task</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Task Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Task Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Design Landing Page"
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Project Selector */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Project <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                                required
                            >
                                <option value="" disabled>Select a project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id} className="dark:bg-[#1a1c23]">{p.name}</option>
                                ))}
                            </select>
                            <FaLayerGroup className="absolute left-2.5 top-3.5 text-gray-400 dark:text-gray-500" size={14} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Add details about this task..."
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none placeholder-gray-400 dark:placeholder-gray-500"
                        ></textarea>
                    </div>

                    {/* Metadata Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                            >
                                <option value="TODO" className="dark:bg-[#1a1c23]">To Do</option>
                                <option value="IN_PROGRESS" className="dark:bg-[#1a1c23]">In Progress</option>
                                <option value="COMPLETED" className="dark:bg-[#1a1c23]">Completed</option>
                                <option value="CANCELED" className="dark:bg-[#1a1c23]">Cancelled</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                                >
                                    <option value="LOW" className="dark:bg-[#1a1c23]">Low</option>
                                    <option value="MEDIUM" className="dark:bg-[#1a1c23]">Medium</option>
                                    <option value="HIGH" className="dark:bg-[#1a1c23]">High</option>
                                </select>
                                <FaRegFlag className={`absolute left-2.5 top-3 ${priority === 'HIGH' ? 'text-red-500' : priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'}`} size={12} />
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Due Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                                />
                                <FaCalendarAlt className="absolute left-2.5 top-3 text-gray-400 dark:text-gray-500" size={14} />
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Assignee</label>
                            <div className="relative">
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none"
                                >
                                    <option value="" className="dark:bg-[#1a1c23]">Unassigned</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.id} value={member.id} className="dark:bg-[#1a1c23]">
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                                <FaUser className="absolute left-2.5 top-3 text-gray-400 dark:text-gray-500" size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all transform active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
