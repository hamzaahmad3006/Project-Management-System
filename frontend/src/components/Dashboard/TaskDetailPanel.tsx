import React from 'react';
import {
    FaTimes, FaExpandAlt, FaShare, FaStar, FaLink, FaEllipsisH,
    FaCheckCircle, FaPlus, FaPaperclip, FaRegFilePdf, FaRegFileWord,
    FaRegCheckCircle, FaRegComment, FaTrash, FaSpinner
} from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTaskById, clearCurrentTask } from '../../store/slices/taskSlice';
import { fetchComments, addComment, clearComments } from '../../store/slices/commentSlice';
import { toggleSubtask } from '../../store/slices/taskSlice';
import { Task, Comment } from '../../types';
import { uploadToCloudinary } from '../../utils/uploadCloudinary';
import AddSubtaskModal from '../modals/AddSubtaskModal';

interface TaskDetailPanelProps {
    task: Task;
    onClose: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task: initialTask, onClose }) => {
    const dispatch = useAppDispatch();
    const { currentTask } = useAppSelector(state => state.tasks);

    const { comments } = useAppSelector(state => state.comments);
    const { user: currentUser } = useAppSelector(state => state.auth);
    const [commentText, setCommentText] = React.useState('');
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isSubtaskModalOpen, setIsSubtaskModalOpen] = React.useState(false);
    const [showMoreFields, setShowMoreFields] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (initialTask?.id) {
            dispatch(fetchTaskById(initialTask.id));
            dispatch(fetchComments(initialTask.id));
        }
        return () => {
            dispatch(clearComments());
        };
    }, [initialTask?.id, dispatch]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendComment = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!commentText.trim() && selectedFiles.length === 0) || !task?.id) return;

        try {
            setIsUploading(true);
            const attachmentUrls: string[] = [];

            // Upload files if any
            if (selectedFiles.length > 0) {
                for (const file of selectedFiles) {
                    const url = await uploadToCloudinary(file);
                    attachmentUrls.push(url);
                }
            }

            await dispatch(addComment({
                taskId: task.id,
                content: commentText.trim(),
                attachments: attachmentUrls
            })).unwrap();

            setCommentText('');
            setSelectedFiles([]);
        } catch (error) {
            console.error("Failed to post comment:", error);
            // Optionally add toast notification here
        } finally {
            setIsUploading(false);
        }
    };

    const task: Task = currentTask || initialTask;
    if (!task) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white dark:bg-[#1a1c23] shadow-2xl transform transition-transform duration-300 ease-in-out z-[100] border-l border-gray-200 dark:border-gray-800 flex flex-col hover:overflow-y-auto">
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
                    <div className="flex flex-wrap gap-2">
                        {(task.label?.length ? task.label : []).map((lbl: string, idx: number) => {
                            const colors: Record<string, string> = {
                                design: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
                                bug: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
                                mobile: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
                                api: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
                                plan: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
                                development: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
                                marketing: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
                                feature: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
                                urgent: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                            };
                            const defaultColor = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

                            return (
                                <span key={idx} className={`px-2 py-0.5 rounded text-xs font-medium ${colors[lbl.toLowerCase()] || defaultColor}`}>
                                    {lbl}
                                </span>
                            );
                        })}

                        {(!task.label || task.label.length === 0) && (
                            <span className="text-xs text-gray-400 italic">No labels</span>
                        )}
                    </div>

                    {/* Custom Field */}
                    <div className="text-gray-400 dark:text-gray-600 pt-1 flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        <FaPlus size={10} /> Add custom field
                    </div>
                </div>

                <div className="text-center mb-8">
                    <button
                        onClick={() => setShowMoreFields(!showMoreFields)}
                        className="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        {showMoreFields ? "Hide fields" : "Show 2 more fields"}
                    </button>
                </div>

                {showMoreFields && (
                    <>
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                            <div className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap min-h-[50px] p-2 rounded bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50">
                                {task.description || "No description provided."}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="mb-8">
                            {(() => {
                                const allAttachments = comments.flatMap(c => c.attachments || []);
                                return (
                                    <>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            Attachments <span className="text-gray-400 dark:text-gray-600 font-normal">{allAttachments.length}</span>
                                        </h3>
                                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                            {allAttachments.length > 0 ? allAttachments.map((url, idx) => {
                                                const isPdf = url.toLowerCase().includes('.pdf');
                                                const isWord = url.toLowerCase().includes('.doc') || url.toLowerCase().includes('.docx');
                                                const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;

                                                const fileName = url.split('/').pop()?.split('#')[0].split('?')[0] || `Attachment ${idx + 1}`;
                                                const decodedFileName = decodeURIComponent(fileName);

                                                return (
                                                    <a
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg min-w-[200px] hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                                    >
                                                        <div className={`w-10 h-10 rounded flex items-center justify-center ${isPdf ? 'bg-red-100 dark:bg-red-900/30 text-red-500' :
                                                            isWord ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' :
                                                                'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                            }`}>
                                                            {isPdf ? <FaRegFilePdf size={20} /> :
                                                                isWord ? <FaRegFileWord size={20} /> :
                                                                    isImage ? <img src={url} alt="preview" className="w-full h-full object-cover rounded" /> :
                                                                        <FaPaperclip size={20} />}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate w-32" title={decodedFileName}>
                                                                {decodedFileName}
                                                            </div>
                                                            <div className="text-xs text-gray-400 dark:text-gray-500">Download</div>
                                                        </div>
                                                    </a>
                                                );
                                            }) : (
                                                <div className="text-xs text-gray-400 italic py-2">No attachments found</div>
                                            )}

                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </>
                )}

                {/* Subtasks */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        Subtasks <span className="text-gray-400 dark:text-gray-600 font-normal">{task.subtasks?.length || 0}</span>
                    </h3>

                    <div className="space-y-2 mb-3">
                        {task.subtasks && task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-lg group hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors">
                                <button
                                    onClick={() => dispatch(toggleSubtask({ subtaskId: subtask.id }))}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${subtask.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-green-500'
                                        }`}
                                >
                                    <FaCheckCircle size={10} />
                                </button>
                                <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {subtask.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsSubtaskModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 px-1 py-1"
                    >
                        <FaPlus size={12} />
                        Add Subtask
                    </button>
                    {initialTask?.id && (
                        <AddSubtaskModal
                            isOpen={isSubtaskModalOpen}
                            onClose={() => setIsSubtaskModalOpen(false)}
                            taskId={initialTask.id}
                        />
                    )}
                </div>

                {/* Comments List */}
                <div className="mb-8 mt-12">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            Comments <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-400">{comments?.length || 0}</span>
                        </div>
                    </h3>

                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((c: Comment) => (
                                <div key={c.id} className="flex gap-4 group">
                                    <img
                                        src={c.author.avatar || `https://ui-avatars.com/api/?name=${c.author.name}`}
                                        className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex-shrink-0"
                                        alt={c.author.name}
                                    />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{c.author.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-xl rounded-tl-none border border-gray-100 dark:border-gray-800/50">
                                            {c.content}
                                        </div>
                                        {c.attachments && c.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {c.attachments.map((url, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative group"
                                                    >
                                                        <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                            <FaLink size={12} />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <FaRegComment size={32} className="mx-auto text-gray-200 dark:text-gray-800 mb-3" />
                                <p className="text-xs text-gray-400 italic">No comments yet. Start the conversation!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {/* Footer Comment Input */}
            <form onSubmit={handleSendComment} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1c23]">
                <div className="flex items-center gap-3">
                    <img
                        src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}`}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                        alt="Me"
                    />
                    <div className="flex-1 relative">
                        {/* File Previews */}
                        {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-4 pb-2">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                        <span className="truncate max-w-[100px]">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="hover:text-red-500"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendComment()}
                                placeholder="Add a comment..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            />
                            <div className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 flex gap-2 items-center">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <FaPaperclip size={14} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={(!commentText.trim() && selectedFiles.length === 0) || isUploading}
                                    className="text-xs hover:text-blue-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-400 font-bold flex items-center gap-1"
                                >
                                    {isUploading ? <FaSpinner className="animate-spin" /> : 'POST'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div >
    );
};

export default TaskDetailPanel;
