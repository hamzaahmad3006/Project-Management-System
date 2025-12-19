import React from 'react';
import {
    FaTimes, FaExpandAlt, FaShare, FaStar, FaLink, FaEllipsisH,
    FaCheckCircle, FaPlus, FaPaperclip, FaRegFilePdf, FaRegFileWord,
    FaRegCheckCircle, FaRegComment
} from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTaskById, clearCurrentTask } from '../../store/slices/taskSlice';
import { Task } from '../../types';

interface TaskDetailPanelProps {
    task: Task;
    onClose: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task: initialTask, onClose }) => {
    const dispatch = useAppDispatch();
    const { currentTask } = useAppSelector(state => state.tasks);

    React.useEffect(() => {
        if (initialTask?.id) {
            dispatch(fetchTaskById(initialTask.id));
        }
        return () => {
            dispatch(clearCurrentTask());
        };
    }, [initialTask?.id, dispatch]);

    const task: Task = currentTask || initialTask;
    if (!task) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white dark:bg-[#1a1c23] shadow-2xl transform transition-transform duration-300 ease-in-out z-40 border-l border-gray-200 dark:border-gray-800 flex flex-col hover:overflow-y-auto">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                    <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><FaCheckCircle size={16} /></button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                    <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><FaExpandAlt size={14} /></button>
                </div>
                <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Share</span>
                    <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><FaStar size={14} /></button>
                    <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><FaLink size={14} /></button>
                    <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><FaEllipsisH size={14} /></button>
                    <button onClick={onClose} className="hover:text-gray-800 dark:hover:text-gray-200 ml-2 transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">
                    {task.name}
                </h2>

                {/* Properties Grid */}
                <div className="grid grid-cols-[140px_1fr] gap-y-6 mb-10 text-sm">
                    {/* Status */}
                    <div className="text-gray-500 dark:text-gray-400 pt-1">Status</div>
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs border border-green-200 dark:border-green-800 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {task.status?.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Assignee */}
                    <div className="text-gray-500 dark:text-gray-400 pt-1">Assignee</div>
                    <div className="flex items-center gap-2">
                        {task.assignedTo ? (
                            <>
                                <img
                                    src={task.assignedTo.avatar || "https://ui-avatars.com/api/?name=" + task.assignedTo.name}
                                    alt="Assignee"
                                    className="w-6 h-6 rounded-full border border-gray-100 dark:border-gray-700"
                                />
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{task.assignedTo.name}</span>
                            </>
                        ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="text-gray-500 dark:text-gray-400 pt-1">Priority</div>
                    <div>
                        <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium border ${task.priority === 'HIGH' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' :
                                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            }`}>
                            {task.priority || 'MEDIUM'}
                        </span>
                    </div>

                    {/* Due Date */}
                    <div className="text-gray-900 dark:text-gray-100">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </div>

                    {/* Tags */}
                    <div className="text-gray-500 dark:text-gray-400 pt-1">Tags</div>
                    <div className="flex gap-2">
                        {(task.label || ['design', 'web']).map((lbl: string, idx: number) => (
                            <span key={idx} className={`px-2 py-0.5 rounded text-xs font-medium 
                                ${lbl === 'design' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800' :
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'}`}>
                                {lbl}
                            </span>
                        ))}
                    </div>

                    {/* Custom Field */}
                    <div className="text-gray-400 dark:text-gray-600 pt-1 flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        <FaPlus size={10} /> Add custom field
                    </div>
                </div>

                <div className="text-center mb-8">
                    <span className="text-xs text-gray-300 dark:text-gray-600">Show 2 empty fields</span>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                    <div className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap min-h-[50px] p-2 rounded bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50">
                        {task.description || "No description provided."}
                    </div>
                </div>

                {/* Attachments */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        Attachments <span className="text-gray-400 dark:text-gray-600 font-normal">2</span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {/* Attachment 1 */}
                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg min-w-[200px] hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-500 rounded flex items-center justify-center">
                                <FaRegFilePdf size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">Profile@2x.pdf</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">PDF-Download</div>
                            </div>
                        </div>
                        {/* Attachment 2 */}
                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg min-w-[200px] hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded flex items-center justify-center">
                                <FaRegFileWord size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">Zaswiadczenie.docx</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">Doc file-Download</div>
                            </div>
                        </div>
                        {/* Upload Button */}
                        <div className="w-12 h-12 flex-shrink-0 border border-gray-200 dark:border-gray-800 border-dashed rounded flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all">
                            <FaPlus size={16} />
                        </div>
                    </div>
                </div>

                {/* Subtasks */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        Subtasks <span className="text-gray-400 dark:text-gray-600 font-normal">2</span>
                    </h3>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between py-2 group hover:bg-gray-50 dark:hover:bg-gray-800/30 -mx-2 px-2 rounded transition-colors">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-gray-300 dark:text-gray-700 cursor-pointer hover:text-green-500 transition-colors" />
                                <span className="text-sm text-gray-800 dark:text-gray-200">Reporting: Design concept of visual dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Aug 23</span>
                                <img src="https://i.pravatar.cc/150?u=a" className="w-5 h-5 rounded-full border border-gray-100 dark:border-gray-700" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 group hover:bg-gray-50 dark:hover:bg-gray-800/30 -mx-2 px-2 rounded transition-colors">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-gray-300 dark:text-gray-700 cursor-pointer hover:text-green-500 transition-colors" />
                                <span className="text-sm text-gray-800 dark:text-gray-200">Visualization and visual dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1 rounded">Today</span>
                                <img src="https://i.pravatar.cc/150?u=b" className="w-5 h-5 rounded-full border border-gray-100 dark:border-gray-700" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 py-2 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                            <FaPlus size={10} />
                            <span className="text-xs">Add subtask</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Comment Input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1c23]">
                <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 flex gap-2">
                            <span className="text-xs hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">@</span>
                            <span className="text-xs hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">☺</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPanel;
