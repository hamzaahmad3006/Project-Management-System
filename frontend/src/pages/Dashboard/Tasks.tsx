import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, updateTask, updateTaskStatusOptimistic } from '../../store/slices/taskSlice';
import CreateGlobalTaskModal from '../../components/Modals/CreateGlobalTaskModal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus } from '../../types';
import {
    FaSearch, FaPlus, FaFilter, FaSortAmountDown, FaThLarge, FaList,
    FaEllipsisH, FaPaperclip, FaCheckSquare, FaCalendarAlt
} from 'react-icons/fa';


const Tasks: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);

    const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchTasks({}));
    }, [dispatch]);

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
        { id: 'TODO', title: 'To-Do', color: 'bg-blue-500', items: tasks.filter(t => t.status === 'TODO' || !t.status) },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-orange-500', items: tasks.filter(t => t.status === 'IN_PROGRESS') },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500', items: tasks.filter(t => t.status === 'COMPLETED') },
        { id: 'CANCELED', title: 'Cancelled', color: 'bg-red-500', items: tasks.filter(t => t.status === 'CANCELED') },
    ];

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
                                                <button className="hover:text-gray-600 dark:hover:text-gray-400"><FaPlus size={12} /></button>
                                                <button className="hover:text-gray-600 dark:hover:text-gray-400"><FaEllipsisH size={12} /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-8 no-scrollbar">
                                            {col.items.map((task, idx) => (
                                                <Draggable key={task.id} draggableId={task.id} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-[#1a1c23] p-4 rounded-xl border shadow-sm transition-all cursor-pointer group
                                                                ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800 hover:shadow-md'}`}
                                                        >
                                                            {/* Card Top: Labels & Menu */}
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex gap-1">
                                                                    {/* Mock Tag */}
                                                                    <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30">Design</span>
                                                                </div>
                                                                <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <FaEllipsisH size={14} />
                                                                </button>
                                                            </div>

                                                            {/* Title */}
                                                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 leading-snug">{task.name}</h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{task.description || "No description provided."}</p>


                                                            {/* Footer Row */}
                                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800 mt-auto">
                                                                {/* Left: Metadata */}
                                                                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                                                                    <div className="flex items-center gap-1 text-xs" title="Due Date">
                                                                        <FaCalendarAlt size={10} />
                                                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs">
                                                                        <FaCheckSquare size={12} /> <span className="text-[10px]">2/7</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs">
                                                                        <FaPaperclip size={10} /> <span className="text-[10px]">3</span>
                                                                    </div>
                                                                </div>

                                                                {/* Right: Priority & Assignee */}
                                                                <div className="flex items-center gap-2">
                                                                    {/* Assignee Avatar */}
                                                                    {task.assignedTo ? (
                                                                        <img src={task.assignedTo.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo.name}`} alt={task.assignedTo.name} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-gray-400">?</div>
                                                                    )}

                                                                    {/* Priority Badge */}
                                                                    <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border
                                                                        ${task.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                                                            task.priority === 'LOW' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' :
                                                                                'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30'}`}>
                                                                        {task.priority || 'MED'}
                                                                    </span>
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
                                                className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2"
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
