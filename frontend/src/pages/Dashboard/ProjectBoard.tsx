import React, { useState } from 'react';
import {
    FaStar, FaEllipsisH, FaSearch, FaFilter, FaSort, FaList,
    FaTh, FaCalendarAlt, FaStream, FaPlus, FaChevronDown, FaChevronRight, FaChevronLeft,
    FaCheckCircle, FaRegCircle, FaRegComment, FaPaperclip, FaUserCircle
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateProjectModal from '../../components/Modals/CreateProjectModal';
import TaskDetailPanel from '../../components/Dashboard/TaskDetailPanel';
import { useAppDispatch } from '../../store/hooks';
import { createTask } from '../../store/slices/taskSlice';
import { Task, Section } from '../../types';



import { useProjectBoard } from '../../utils/Hooks/DashBoardHooks';

const ProjectBoard: React.FC = () => {
    const {
        loading,
        activeView,
        setActiveView,
        collapsedSections,
        toggleSection,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedTask,
        setSelectedTask,
        handleAddTask,
        handleDragEnd,
        sections,
        calendarEvents,
        currentDate,
        calendarDays,
        handlePrevMonth,
        handleNextMonth,
        handleGoToToday
    } = useProjectBoard();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = new Date();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#12141c]">
            {/* Header */}
            <header className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">Project Board [2023]</h1>
                            <FaStar className="text-yellow-400 cursor-pointer" />
                            <FaEllipsisH className="text-gray-400 dark:text-gray-500 cursor-pointer" />
                        </div>
                        <span className="md:hidden px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            On track
                        </span>
                    </div>

                    <div className="hidden md:flex px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        On track
                    </div>

                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
                        {/* Avatars placeholder */}
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-800"></div>
                            <div className="w-8 h-8 rounded-full bg-blue-300 dark:bg-blue-700 border-2 border-white dark:border-gray-800"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-300 dark:bg-indigo-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-white">4</div>
                        </div>

                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                Share
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                            >
                                Create
                                <FaChevronDown size={10} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 min-w-max">
                        {['Board', 'Table', 'Calendar', 'Timeline'].map(view => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view)}
                                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${activeView === view ? 'border-gray-800 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                {view === 'Board' && <FaTh size={14} />}
                                {view === 'Table' && <FaList size={14} />}
                                {view === 'Calendar' && <FaCalendarAlt size={14} />}
                                {view === 'Timeline' && <FaStream size={14} />}
                                {view}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 pb-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <FaPlus size={12} /> Add
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 min-w-max md:w-auto">
                        <div className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors">
                            <FaSearch size={14} /> <span className="hidden sm:inline">Search</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors">
                            <FaFilter size={14} /> <span className="hidden sm:inline">Filter</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors">
                            <FaSort size={14} /> <span className="hidden sm:inline">Sort</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors">
                            <FaList size={14} /> <span className="hidden sm:inline">Fields</span>
                        </div>
                    </div>
                </div>
            </header>


            {/* Content Switcher */}
            <div className="flex-1 overflow-auto bg-white dark:bg-[#12141c] p-6">
                {activeView === 'Board' ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex items-start h-full gap-6 min-w-max">
                            {sections.map(section => (
                                <Droppable key={section.id} droppableId={section.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex flex-col h-full transition-colors duration-200 
                                                ${section.id === 'postpone' ? 'w-10 items-center rounded-lg pt-4' : 'w-72'}
                                                ${snapshot.isDraggingOver ? (section.id === 'postpone' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50/50 dark:bg-blue-900/10') : (section.id === 'postpone' ? 'bg-gray-50 dark:bg-[#1a1c23]' : '')}`}
                                        >
                                            {/* Column Header */}
                                            {section.id === 'postpone' ? (
                                                <div className="flex-1 flex flex-col items-center pointer-events-none">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mb-6 font-bold"></div>
                                                    <div className="rotate-90 text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap tracking-wide origin-center translate-y-8">
                                                        {section.title} <span className="ml-2 font-normal">{section.count}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2 mb-4 px-1">
                                                        <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
                                                        <span className="text-gray-400 dark:text-gray-500 text-sm">{section.count}</span>
                                                        <div className="ml-auto flex gap-2 text-gray-400 dark:text-gray-500">
                                                            <FaPlus size={12} className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" />
                                                            <FaEllipsisH size={12} className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" />
                                                        </div>
                                                    </div>

                                                    {/* Tasks List */}
                                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                                        {section.tasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onClick={() => setSelectedTask(task)}
                                                                        className={`bg-white dark:bg-[#1a1c23] border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group
                                                                            ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50' : 'border-gray-200 dark:border-gray-800'}`}
                                                                    >
                                                                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2 leading-tight">{task.name}</h4>

                                                                        {/* Labels */}
                                                                        {(task.label?.length || 0) > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                                {task.label?.map((lbl, i) => (
                                                                                    <span
                                                                                        key={i}
                                                                                        className={`px-1.5 py-0.5 text-[10px] font-medium rounded 
                                                                                            ${lbl === 'design' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                                lbl === 'bug' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                                                    lbl === 'API' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                                                                                        lbl === 'plan' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                                                                                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                                                                    >
                                                                                        {lbl}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {/* Footer */}
                                                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                                                                            <div className="flex items-center gap-2">
                                                                                {task.assignedTo && (
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <img src={task.assignedTo.avatar || "https://ui-avatars.com/api/?name=" + task.assignedTo.name} alt={task.assignedTo.name} className="w-5 h-5 rounded-full" />
                                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.assignedTo.name}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                                                                                {task.comments && (
                                                                                    <div className="flex items-center gap-1 text-xs">
                                                                                        <FaRegComment size={10} /> {task.comments}
                                                                                    </div>
                                                                                )}
                                                                                {task.attachments && (
                                                                                    <div className="flex items-center gap-1 text-xs">
                                                                                        <FaPaperclip size={10} /> {task.attachments}
                                                                                    </div>
                                                                                )}
                                                                                {task.dueDate && (
                                                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                                                                        {task.dueDate}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        {/* Add Task Button */}
                                                        <button
                                                            onClick={() => handleAddTask("New Task", section.id)}
                                                            className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm py-1 w-full transition-colors"
                                                        >
                                                            <FaPlus size={12} /> Add task
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}

                            {/* Add Section Button */}
                            <button className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium pt-1 whitespace-nowrap transition-colors">
                                <FaPlus size={12} /> Add section
                            </button>
                        </div>
                    </DragDropContext>
                ) : activeView === 'Calendar' ? (
                    // Calendar View Content
                    <div className="flex flex-col min-w-[800px] p-2 pb-12">
                        {/* Calendar Controls */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h2>
                                <FaChevronDown size={12} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
                                    <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-r border-gray-300 dark:border-gray-700">Month</button>
                                    <button
                                        onClick={handleGoToToday}
                                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                                    >Today</button>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 ml-2">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    ><FaChevronLeft size={14} /></button>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    ><FaChevronRight size={14} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 border border-gray-100 dark:border-gray-800/10 rounded-xl overflow-hidden flex flex-col bg-white dark:bg-[#0f1117] shadow-sm">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-50 dark:border-gray-800/10 py-3 bg-gray-50/50 dark:bg-gray-900/10">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="flex-1 grid grid-cols-7">
                                {calendarDays.map((cell, i) => {
                                    const dayNum = cell.day;
                                    const isCurrentMonth = cell.isCurrentMonth;
                                    const isToday = dayNum === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear();
                                    const events = calendarEvents.filter(e => e.date === dayNum && e.month === cell.month && e.year === cell.year);

                                    return (
                                        <div
                                            key={i}
                                            className={`border-b border-r border-gray-50 dark:border-gray-800/10 p-2.5 relative min-h-[180px] hover:bg-gray-50/20 dark:hover:bg-gray-800/5 transition-colors flex flex-col ${!isCurrentMonth ? 'bg-gray-50/20 dark:bg-gray-900/5' : 'bg-white dark:bg-[#0f1117]'}`}
                                        >
                                            <div className="flex justify-end mb-2.5">
                                                <span className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all
                                                                ${!isCurrentMonth ? 'text-gray-200 dark:text-gray-800' : isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 dark:text-gray-600'}`}>
                                                    {dayNum}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 overflow-y-auto no-scrollbar pb-1">
                                                {events.map((event, idx) => (
                                                    <div
                                                        key={`${event.id}-${idx}`}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTask(event.task); }}
                                                        className={`px-2 py-1 rounded shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${event.color} flex flex-col min-w-0`}
                                                    >
                                                        <div className="text-[10px] font-bold leading-tight truncate">{event.title}</div>
                                                        <div className="text-[8px] opacity-90 font-medium tracking-tight">
                                                            {event.type === 'assign' ? 'Assigned' : 'Due Date'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : activeView === 'Table' ? (
                    // Table View Content
                    <div className="min-w-[800px] overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            <div className="col-span-6 pl-8">Name</div>
                            <div className="col-span-2">Assignee</div>
                            <div className="col-span-2">Due date</div>
                            <div className="col-span-2">Label</div>
                        </div>

                        {/* Sections */}
                        {sections.map(section => (
                            <div key={section.id} className="mt-6">
                                {/* Section Header */}
                                <div
                                    className="flex items-center gap-2 mb-2 group cursor-pointer"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    {collapsedSections.includes(section.id) ? (
                                        <FaChevronRight className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" size={12} />
                                    ) : (
                                        <FaChevronDown className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" size={12} />
                                    )}
                                    <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{section.count}</span>
                                    <FaEllipsisH className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 ml-2 transition-opacity" size={12} />
                                    <FaPlus className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 ml-1 transition-opacity" size={12} />
                                </div>

                                {/* Tasks */}
                                {!collapsedSections.includes(section.id) && (
                                    <div className="space-y-1">
                                        {section.tasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 items-center text-sm group cursor-pointer transition-colors"
                                            >
                                                <div className="col-span-6 flex items-center gap-3 pl-2">
                                                    <FaCheckCircle className="text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 cursor-pointer transition-colors" />
                                                    <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{task.name}</span>
                                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                                                        {task.comments && (
                                                            <div className="flex items-center gap-1 text-[10px]">
                                                                <FaRegComment size={10} /> {task.comments}
                                                            </div>
                                                        )}
                                                        {task.attachments && (
                                                            <div className="flex items-center gap-1 text-[10px]">
                                                                <FaPaperclip size={10} /> {task.attachments}
                                                            </div>
                                                        )}
                                                        <FaStream className="opacity-0 group-hover:opacity-100 transition-opacity" size={10} />
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {task.assignedTo ? (
                                                        <>
                                                            <img src={task.assignedTo.avatar || "https://ui-avatars.com/api/?name=" + task.assignedTo.name} alt={task.assignedTo.name} className="w-5 h-5 rounded-full border border-transparent dark:border-gray-700" />
                                                            <span className="text-gray-600 dark:text-gray-400 text-xs">{task.assignedTo.name}</span>
                                                        </>
                                                    ) : (
                                                        <FaUserCircle className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                                    )}
                                                </div>
                                                <div className="col-span-2 text-gray-600 dark:text-gray-400 text-xs">
                                                    {task.dueDate || ''}
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {task.label?.map((lbl, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`px-2 py-0.5 rounded text-xs font-medium 
                                                                    ${lbl === 'design' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                                    lbl === 'bug' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                                        lbl === 'mobile' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                                                            lbl === 'API' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                                                lbl === 'plan' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                                                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'}`}
                                                        >
                                                            {lbl}
                                                        </span>
                                                    ))}
                                                    <FaPlus className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 cursor-pointer ml-auto transition-opacity" size={10} />
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add Task Row */}
                                        <div className="flex items-center gap-3 py-2 pl-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">
                                            <FaPlus size={12} />
                                            <span className="text-sm">Add task</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Timeline View Content
                    <div className="flex flex-col h-full min-w-[800px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">October - December 2024</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">View by:</span>
                                <select className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500/50">
                                    <option>Months</option>
                                    <option>Weeks</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-[#1a1c23]">
                            {/* Timeline Header */}
                            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <div className="w-1/4 p-3 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">Task Name</div>
                                <div className="flex-1 grid grid-cols-3">
                                    <div className="p-3 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase text-center border-r border-gray-200 dark:border-gray-800">Oct</div>
                                    <div className="p-3 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase text-center border-r border-gray-200 dark:border-gray-800">Nov</div>
                                    <div className="p-3 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase text-center">Dec</div>
                                </div>
                            </div>

                            {/* Timeline Body */}
                            <div className="flex-1 overflow-y-auto relative no-scrollbar">
                                {sections.flatMap(s => s.tasks).slice(0, 8).map((task, i) => (
                                    <div key={task.id} className="flex border-b border-gray-100 dark:border-gray-800/50 h-12 items-center hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <div className="w-1/4 p-3 text-sm text-gray-700 dark:text-gray-300 truncate border-r border-gray-200 dark:border-gray-800">{task.name}</div>
                                        <div className="flex-1 relative h-full">
                                            <div
                                                className={`absolute top-3 h-6 rounded shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer ${i % 2 === 0 ? 'bg-blue-400 dark:bg-blue-600' : 'bg-indigo-400 dark:bg-indigo-600'}`}
                                                style={{
                                                    left: `${(i * 10) % 60}%`,
                                                    width: `${20 + (i * 5)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}

                                {/* Day Divider Lines (Mock) */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    <div className="w-1/4 border-r border-gray-200 dark:border-gray-800"></div>
                                    <div className="flex-1 grid grid-cols-12">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="border-r border-gray-100/50 dark:border-gray-800/30"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {/* Task Detail Panel */}
            {selectedTask && (
                <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    );
};

export default ProjectBoard;
