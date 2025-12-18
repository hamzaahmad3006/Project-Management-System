import React, { useEffect, useState } from 'react';
import { FaTimes, FaUser, FaRegFlag, FaCalendarAlt, FaLayerGroup, FaColumns, FaPaperclip } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTask } from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { CreateModalProps } from '../../types';

const CreateGlobalTaskModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state) => state.projects);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('TODO');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchProjects());
        }
    }, [isOpen, dispatch]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId) {
            alert("Please select a project");
            return;
        }

        // Dispatch action
        await dispatch(createTask({
            name,
            description,
            status,
            priority,
            dueDate,
            assigneeId,
            sectionId: sectionId || 'backlog', // Fallback
            projectId
        }));

        onClose();
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setProjectId('');
        setSectionId('');
        setFiles([]);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh] border border-transparent dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Create New Task</h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Top Config: Project & Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            {/* Project Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                    <FaLayerGroup /> Project
                                </label>
                                <select
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                                    required
                                >
                                    <option value="" className="dark:bg-gray-800">Select a Project...</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id} className="dark:bg-gray-800">{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                    <FaColumns /> Section
                                </label>
                                <select
                                    value={sectionId}
                                    onChange={(e) => setSectionId(e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                                >
                                    <option value="" className="dark:bg-gray-800">Default (Backlog)</option>
                                    <option value="backlog" className="dark:bg-gray-800">Backlog</option>
                                    <option value="todo" className="dark:bg-gray-800">To Do</option>
                                    <option value="inprogress" className="dark:bg-gray-800">In Progress</option>
                                    <option value="done" className="dark:bg-gray-800">Done</option>
                                </select>
                            </div>
                        </div>

                        {/* Task Name */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Task Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="What needs to be done?"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all text-sm font-medium placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Add more details..."
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all resize-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
                            ></textarea>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500"
                                >
                                    <option value="TODO" className="dark:bg-gray-800">To Do</option>
                                    <option value="IN_PROGRESS" className="dark:bg-gray-800">In Progress</option>
                                    <option value="COMPLETED" className="dark:bg-gray-800">Completed</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Priority</label>
                                <div className="relative">
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full pl-7 pr-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 appearance-none focus:border-blue-500"
                                    >
                                        <option value="LOW" className="dark:bg-gray-800">Low</option>
                                        <option value="MEDIUM" className="dark:bg-gray-800">Medium</option>
                                        <option value="HIGH" className="dark:bg-gray-800">High</option>
                                    </select>
                                    <FaRegFlag className={`absolute left-2.5 top-2.5 ${priority === 'HIGH' ? 'text-red-500' : priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'}`} size={12} />
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Due Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full pl-7 pr-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                    <FaCalendarAlt className="absolute left-2.5 top-2.5 text-gray-400 dark:text-gray-500" size={12} />
                                </div>
                            </div>

                            {/* Assignee */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Assignee</label>
                                <div className="relative">
                                    <select
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        className="w-full pl-7 pr-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 appearance-none focus:border-blue-500"
                                    >
                                        <option value="" className="dark:bg-gray-800">Unassigned</option>
                                        <option value="user1" className="dark:bg-gray-800">Me</option>
                                        <option value="user2" className="dark:bg-gray-800">John Doe</option>
                                    </select>
                                    <FaUser className="absolute left-2.5 top-2.5 text-gray-400 dark:text-gray-500" size={12} />
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 border-dashed">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaPaperclip className="w-5 h-5 mb-2 text-gray-400 dark:text-gray-500" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-tight">PDF, PNG, JPG (MAX. 10MB)</p>
                                    </div>
                                    <input type="file" className="hidden" multiple onChange={handleFileChange} />
                                </label>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <ul className="space-y-1 mt-2">
                                    {files.map((file, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
                                            <FaPaperclip size={10} className="text-gray-400" />
                                            <span className="truncate max-w-[200px]">{file.name}</span>
                                            <span className="text-gray-400 dark:text-gray-600 ml-auto">{(file.size / 1024).toFixed(0)} KB</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => document.getElementById('create-task-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                        className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all transform active:scale-95"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGlobalTaskModal;
