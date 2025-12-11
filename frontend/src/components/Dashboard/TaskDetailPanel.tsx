import React from 'react';
import {
    FaTimes, FaExpandAlt, FaShare, FaStar, FaLink, FaEllipsisH,
    FaCheckCircle, FaPlus, FaPaperclip, FaRegFilePdf, FaRegFileWord,
    FaRegCheckCircle, FaRegComment
} from 'react-icons/fa';

interface TaskDetailPanelProps {
    task: any; // Using any for now, ideally strictly typed
    onClose: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 border-l border-gray-200 flex flex-col hover:overflow-y-auto">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4 text-gray-400">
                    <button className="hover:text-gray-600"><FaCheckCircle size={16} /></button>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <button className="hover:text-gray-600"><FaExpandAlt size={14} /></button>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <span className="text-xs text-gray-500 font-medium">Share</span>
                    <button className="hover:text-gray-600"><FaStar size={14} /></button>
                    <button className="hover:text-gray-600"><FaLink size={14} /></button>
                    <button className="hover:text-gray-600"><FaEllipsisH size={14} /></button>
                    <button onClick={onClose} className="hover:text-gray-800 ml-2">
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                    {task.name || "Reporting: Design concept of visual dashboard"}
                </h2>

                {/* Properties Grid */}
                <div className="grid grid-cols-[140px_1fr] gap-y-6 mb-10 text-sm">
                    {/* Status */}
                    <div className="text-gray-500 pt-1">Status</div>
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-100 text-green-700 font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {task.status || "In progress"}
                        </span>
                    </div>

                    {/* Assignee */}
                    <div className="text-gray-500 pt-1">Assignee</div>
                    <div className="flex items-center gap-2">
                        <img
                            src={task.assignee?.avatar || "https://i.pravatar.cc/150?u=eugeniusz"}
                            alt="Assignee"
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-900 font-medium">{task.assignee?.name || "Eugeniusz Rymaszewski"}</span>
                    </div>

                    {/* Priority */}
                    <div className="text-gray-500 pt-1">Priority</div>
                    <div>
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                            Low
                        </span>
                    </div>

                    {/* Due Date */}
                    <div className="text-gray-500 pt-1">Due date</div>
                    <div className="text-gray-900">
                        {task.dueDate || "Oct 24"}
                    </div>

                    {/* Tags */}
                    <div className="text-gray-500 pt-1">Tags</div>
                    <div className="flex gap-2">
                        {(task.label || ['design', 'web']).map((lbl: string, idx: number) => (
                            <span key={idx} className={`px-2 py-0.5 rounded text-xs font-medium ${lbl === 'design' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {lbl}
                            </span>
                        ))}
                    </div>

                    {/* Custom Field */}
                    <div className="text-gray-500 pt-1">Add custom field</div>
                </div>

                <div className="text-center mb-8">
                    <span className="text-xs text-gray-300">Show 2 empty fields</span>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-800 text-sm leading-relaxed">
                        This task involves updating the time page to handle empty weeks, implementing changes for time off, and making some minor adjustments. It's currently in progress, with a high priority, and is part of the Clickup project. The task is assigned to Yauhen Rymasheuski and includes a subtask titled "Time page: part l.
                    </p>
                </div>

                {/* Attachments */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        Attachments <span className="text-gray-400">2</span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {/* Attachment 1 */}
                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg min-w-[200px] hover:bg-gray-50 cursor-pointer">
                            <div className="w-10 h-10 bg-red-100 text-red-500 rounded flex items-center justify-center">
                                <FaRegFilePdf size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-gray-800 truncate">Profile@2x.pdf</div>
                                <div className="text-xs text-gray-400">PDF-Download</div>
                            </div>
                        </div>
                        {/* Attachment 2 */}
                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg min-w-[200px] hover:bg-gray-50 cursor-pointer">
                            <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded flex items-center justify-center">
                                <FaRegFileWord size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-gray-800 truncate">Zaswiadczenie.docx</div>
                                <div className="text-xs text-gray-400">Doc file-Download</div>
                            </div>
                        </div>
                        {/* Upload Button */}
                        <div className="w-10 h-10 border border-gray-200 border-dashed rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer text-xl mt-2">
                            +
                        </div>
                    </div>
                </div>

                {/* Subtasks */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        Subtasks <span className="text-gray-400">2</span>
                    </h3>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between py-2 group hover:bg-gray-50 -mx-2 px-2 rounded">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-gray-300 cursor-pointer hover:text-green-500" />
                                <span className="text-sm text-gray-800">Reporting: Design concept of visual dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100">
                                <span className="text-xs text-gray-500">Aug 23</span>
                                <img src="https://i.pravatar.cc/150?u=a" className="w-5 h-5 rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 group hover:bg-gray-50 -mx-2 px-2 rounded">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-gray-300 cursor-pointer hover:text-green-500" />
                                <span className="text-sm text-gray-800">Visualization and visual dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100">
                                <span className="text-xs text-green-500 bg-green-50 px-1 rounded">Today</span>
                                <img src="https://i.pravatar.cc/150?u=b" className="w-5 h-5 rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 py-2 text-gray-400 cursor-pointer hover:text-gray-600">
                            <FaPlus size={10} />
                            <span className="text-xs">Add subtask</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Comment Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-8 h-8 rounded-full border border-gray-200" />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400 flex gap-2">
                            <span className="text-xs">@</span>
                            <span className="text-xs">☺</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPanel;
