import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, updateTask, updateTaskStatusOptimistic } from '../../store/slices/taskSlice';
import CreateGlobalTaskModal from '../../components/Modals/CreateGlobalTaskModal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus } from '../../types';
import {
    FaSearch, FaPlus, FaFilter, FaSortAmountDown, FaThLarge, FaList,
    FaEllipsisH, FaPaperclip, FaCheckSquare, FaCalendarAlt, FaFlag,
    FaRegCommentDots, FaRegFileAlt
} from 'react-icons/fa';


const Tasks: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const { selectedProjectId } = useAppSelector((state) => state.projects);

    const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = useMemo(() => {
        if (!searchTerm.trim()) return tasks;
        const term = searchTerm.toLowerCase();
        return tasks.filter(t =>
            t.name.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term))
        );
    }, [tasks, searchTerm]);

    useEffect(() => {
        const filters: any = {};
        if (selectedProjectId && selectedProjectId !== 'all') {
            filters.projectId = selectedProjectId;
        }
        dispatch(fetchTasks(filters));
    }, [dispatch, selectedProjectId]);

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as TaskStatus;

        // Optimistic UI Update
        dispatch(updateTaskStatusOptimistic({ id: draggableId, status: newStatus }));

        try {
            await dispatch(updateTask({ id: draggableId, data: { status: newStatus } })).unwrap();
            window.toastify(`Task moved to ${newStatus.toLowerCase().replace('_', ' ')}`, "success");
        } catch (error: any) {
            // Revert on error
            dispatch(fetchTasks({}));
            window.toastify(error || "Failed to move task", "error");
        }
    };

    const columns = [
        { id: 'TODO', title: 'To-Do', color: 'bg-blue-500', items: filteredTasks.filter(t => t.status === 'TODO' || !t.status) },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-orange-500', items: filteredTasks.filter(t => t.status === 'IN_PROGRESS') },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500', items: filteredTasks.filter(t => t.status === 'COMPLETED') },
        { id: 'CANCELED', title: 'Cancelled', color: 'bg-red-500', items: filteredTasks.filter(t => t.status === 'CANCELED') },
    ];

    if (loading && tasks.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#12141c] overflow-hidden">
            <header className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12141c]">
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Tasks</h1>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('KANBAN')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'KANBAN' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <FaThLarge /> Kanban
                            </button>
                            <button
                                onClick={() => setViewMode('LIST')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'LIST' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <FaList /> List
                            </button>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 text-gray-900 dark:text-gray-100"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <FaFilter size={12} /> Filters
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <FaSortAmountDown size={12} /> Sort By
                            </button>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200"
                            >
                                <FaPlus size={12} /> New Task
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 bg-gray-50 dark:bg-[#0f1117]">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex h-full gap-6">
                        {columns.map(col => (
                            <Droppable key={col.id} droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`w-[290px] flex-shrink-0 flex flex-col h-full transition-colors duration-200 rounded-xl px-2 
                                            ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-4 px-1 pt-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                                                <h3 className="font-bold text-gray-700 dark:text-gray-200">{col.title}</h3>
                                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">{col.items.length}</span>
                                            </div>
                                            <div className="flex gap-2 text-gray-400 dark:text-gray-600">
                                                <button className="hover:text-gray-500 dark:hover:text-gray-400"><FaPlus size={12} /></button>
                                                <button className="hover:text-gray-500 dark:hover:text-gray-400"><FaEllipsisH size={12} /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar scroll-smooth">
                                            {col.items.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-[#1a1c23] p-5 rounded-2xl border shadow-sm transition-all cursor-pointer group mb-3
                                                                ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-gray-800 hover:shadow-md'}`}
                                                        >
                                                            {/* Card Top: Project Badge & Menu */}
                                                            <div className="flex justify-between items-center mb-4">
                                                                <span className="px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/40 rounded-md border border-blue-100/50 dark:border-blue-900/30">
                                                                    {task.project?.name || 'Internal'}
                                                                </span>
                                                                <button className="text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                                                                    <FaEllipsisH size={14} />
                                                                </button>
                                                            </div>

                                                            {/* Middle Content Row: Text */}
                                                            <div className="mb-4">
                                                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight tracking-tight">
                                                                    {task.name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-normal">
                                                                    {task.description || "No description provided."}
                                                                </p>
                                                            </div>

                                                            {/* Assignee Info & Priority Row */}
                                                            <div className="space-y-2 mb-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Assignee:</div>
                                                                    {/* Assignee Avatar (Aligned with Label) */}
                                                                    <div className="flex-shrink-0">
                                                                        {task.assignedTo ? (
                                                                            <img
                                                                                src={task.assignedTo.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo.name}`}
                                                                                alt={task.assignedTo.name}
                                                                                className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">?</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    {/* Date with Flag */}
                                                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm font-medium">
                                                                        <FaFlag size={14} className="text-gray-600 dark:text-gray-400" />
                                                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline'}</span>
                                                                    </div>

                                                                    {/* Priority with Dot */}
                                                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider
                                                                        ${task.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30' :
                                                                            task.priority === 'LOW' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100/50 dark:border-green-900/30' :
                                                                                'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100/50 dark:border-yellow-900/30'}`}>
                                                                        <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-600' : task.priority === 'LOW' ? 'bg-green-600' : 'bg-yellow-600'}`} />
                                                                        {task.priority || 'Medium'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Horizontal Separator */}
                                                            <div className="h-px bg-gray-100 dark:bg-gray-800 -mx-5 mb-4" />

                                                            {/* Meta Info Bottom Row */}
                                                            <div className="flex items-center gap-5 text-gray-400 dark:text-gray-500">
                                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                                    <FaRegFileAlt size={16} />
                                                                    <span className="text-sm font-semibold">3/4</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                                    <FaRegCommentDots size={16} />
                                                                    <span className="text-sm font-semibold">{task.comments || 0}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                                    <FaPaperclip size={16} />
                                                                    <span className="text-sm font-semibold">{task.attachments || 7}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Add Card Ghost Button */}
                                            <button
                                                onClick={() => setIsCreateModalOpen(true)}
                                                className="w-full py-2 bg-transparent border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 mt-2"
                                            >
                                                <FaPlus size={10} /> New Task
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Create Task Modal */}
            <CreateGlobalTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default Tasks;
