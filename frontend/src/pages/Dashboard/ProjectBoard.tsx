import React, { useState } from 'react';
import {
    FaStar, FaEllipsisH, FaSearch, FaFilter, FaSort, FaList,
    FaTh, FaCalendarAlt, FaStream, FaPlus, FaChevronDown, FaChevronRight, FaChevronLeft,
    FaCheckCircle, FaRegCircle, FaRegComment, FaPaperclip, FaUserCircle
} from 'react-icons/fa';
import CreateProjectModal from '../../components/Modals/CreateProjectModal';
import TaskDetailPanel from '../../components/Dashboard/TaskDetailPanel';
import { useAppDispatch } from '../../store/hooks';
import { createTaskAction } from '../../store/slices/taskSlice';

interface Task {
    id: string;
    name: string;
    project?: string;
    subtasks?: string;
    status: string;
    priority?: string;
    dueDate?: string;
    label?: string[];
    assignee?: { name: string, avatar: string };
    comments?: number;
    attachments?: number;
}

interface Section {
    id: string;
    title: string;
    count: number;
    color: string;
    tasks: Task[];
}

const ProjectBoard: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activeView, setActiveView] = useState('Table');
    const [collapsedSections, setCollapsedSections] = useState<string[]>(['postpone', 'qa']); // Set default collapsed sections

    const dispatch = useAppDispatch();
    const handleAddTask = (taskName: any, sectionId: any) => {
        const newTaskData = {
            name: taskName,
            sectionId: sectionId, // Kis column mein ban raha hai (e.g., Backlog ID)
            projectId: "current_project_id",
        };
        // Redux action dispatch karo
        dispatch(createTaskAction(newTaskData));
    };
    const toggleSection = (sectionId: string) => {
        setCollapsedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Mock Data
    const sections: Section[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            count: 4,
            color: 'gray',
            tasks: [
                { id: '1', name: 'Contact customers with failed new payents or who churned', status: 'Backlog', dueDate: 'Aug 6', label: ['design', 'design'], assignee: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=henry' }, comments: 2, attachments: 5 },
                { id: '2', name: 'Reporting: Design concept of visual dashboard', status: 'Backlog', dueDate: 'Sep 20', label: ['bug', 'API'], assignee: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=henry' } },
                { id: '3', name: 'Task detail modal: ideas', status: 'Backlog', label: ['mobile'], assignee: { name: 'Billy', avatar: 'https://i.pravatar.cc/150?u=billy' }, attachments: 2 },
                { id: '4', name: 'Reporting: Design concept of visual dashboard', status: 'Backlog', dueDate: 'Aug 23', label: ['design'], assignee: { name: 'Hanna', avatar: 'https://i.pravatar.cc/150?u=hanna' }, comments: 2 },
            ]
        },
        {
            id: 'postpone',
            title: 'Postpone',
            count: 6,
            color: 'red',
            tasks: []
        },
        {
            id: 'inprogress',
            title: 'In progress',
            count: 4,
            color: 'green',
            tasks: [
                { id: '5', name: 'Lead feedback sessions', status: 'In progress', dueDate: 'Aug 6', label: ['design', 'design'], assignee: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex' }, comments: 1 },
                { id: '6', name: 'Add Projects to templates and layouts [draft 2023]', status: 'In progress', assignee: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=henry' }, label: ['design'] },
                { id: '7', name: 'Extension: show totals', status: 'In progress', assignee: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' }, comments: 2 },
                { id: '8', name: 'Help Docs: update screenshot', status: 'In progress', label: ['plan', 'bug'], assignee: { name: 'Billy', avatar: 'https://i.pravatar.cc/150?u=billy' } },
            ]
        },
        {
            id: 'qa',
            title: 'QA',
            count: 4,
            color: 'orange',
            tasks: [
                { id: '9', name: 'Invoices: fixed-fee projects', status: 'QA', label: ['design', 'design'], assignee: { name: 'Adam', avatar: 'https://i.pravatar.cc/150?u=adam' }, comments: 2, attachments: 5 },
                { id: '10', name: 'Time: search - not last response with results appears', status: 'QA', dueDate: 'Sep 8', label: ['bug'], assignee: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=henry' }, comments: 5 },
                { id: '11', name: 'Pricing page: new iteration and few mockups and ideas', status: 'QA' },
                { id: '12', name: '@dev QA: regression ( before/after release)', status: 'QA', dueDate: 'Nov 3', assignee: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex' } },
            ]
        }
    ];

    // Mock Calendar Events for October 2024
    const calendarEvents = [
        { id: '1', title: 'Contact customers wi...', date: 25, color: 'bg-orange-100 ring-1 ring-orange-200 text-orange-700' },
        { id: '2', title: 'Task detail modal', date: 25, color: 'bg-pink-100 ring-1 ring-pink-200 text-pink-700' },
        { id: '3', title: 'Reporting: Design co...', date: 25, color: 'bg-blue-100 ring-1 ring-blue-200 text-blue-700' },
        { id: '4', title: 'Task detail modal', date: 26, color: 'bg-pink-100 ring-1 ring-pink-200 text-pink-700' },
        { id: '5', title: 'Dashboard: concept', date: 26, color: 'bg-green-100 ring-1 ring-green-200 text-green-700' },
        { id: '6', title: 'Help Docs: update scr...', date: 29, color: 'bg-gray-100 ring-1 ring-gray-200 text-gray-700' },
        { id: '7', title: 'Extension: show totals', date: 29, color: 'bg-green-100 ring-1 ring-green-200 text-green-700' },
        { id: '8', title: 'Contact customers wi...', date: 30, color: 'bg-orange-100 ring-1 ring-orange-200 text-orange-700' },
        { id: '9', title: 'Extension: show totals', date: 30, color: 'bg-green-100 ring-1 ring-green-200 text-green-700' },
        { id: '10', title: 'Contact customers wi...', date: 31, color: 'bg-orange-100 ring-1 ring-orange-200 text-orange-700' },
        { id: '11', title: 'Task detail modal', date: 31, color: 'bg-pink-100 ring-1 ring-pink-200 text-pink-700' },
        { id: '12', title: 'Reporting: Design co...', date: 31, color: 'bg-blue-100 ring-1 ring-blue-200 text-blue-700' },
        { id: '13', title: 'Contact customers wi...', date: 4, color: 'bg-orange-100 ring-1 ring-orange-200 text-orange-700' },
        { id: '14', title: 'Task detail modal', date: 4, color: 'bg-pink-100 ring-1 ring-pink-200 text-pink-700' },
        { id: '15', title: 'Reporting: Design co...', date: 4, color: 'bg-blue-100 ring-1 ring-blue-200 text-blue-700' },
        { id: '16', title: 'Dashboard: concept', date: 5, color: 'bg-green-100 ring-1 ring-green-200 text-green-700' },
        { id: '17', title: 'Contact customers wi...', date: 5, color: 'bg-orange-100 ring-1 ring-orange-200 text-orange-700' },
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-800">Project Board [2023]</h1>
                        <FaStar className="text-yellow-400 cursor-pointer" />
                        <FaEllipsisH className="text-gray-400 cursor-pointer" />
                        <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            On track
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Avatars placeholder */}
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-xs font-medium text-white">4</div>
                        </div>

                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
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

                {/* Tabs & Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                        {['Board', 'Table', 'Calendar', 'Timeline'].map(view => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view)}
                                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${activeView === view ? 'border-gray-800 text-gray-900 font-medium' : 'border-transparent hover:text-gray-900'}`}
                            >
                                {view === 'Board' && <FaTh size={14} />}
                                {view === 'Table' && <FaList size={14} />}
                                {view === 'Calendar' && <FaCalendarAlt size={14} />}
                                {view === 'Timeline' && <FaStream size={14} />}
                                {view}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 pb-2 text-gray-500 hover:text-gray-700">
                            <FaPlus size={12} /> Add
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2 hover:text-gray-900 cursor-pointer">
                            <FaSearch size={14} /> Search
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 cursor-pointer">
                            <FaFilter size={14} /> Filter
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 cursor-pointer">
                            <FaSort size={14} /> Sort
                        </div>
                        <div className="flex items-center gap-2 hover:text-gray-900 cursor-pointer">
                            <FaList size={14} /> Fields
                        </div>
                    </div>
                </div>
            </header>


            {/* Content Switcher */}
            <div className="flex-1 overflow-x-auto bg-white p-6">
                {activeView === 'Board' ? (
                    <div className="flex items-start h-full gap-6 min-w-max">
                        {sections.map(section => (
                            <div
                                key={section.id}
                                className={`flex flex-col h-full ${section.id === 'postpone' ? 'w-10 items-center bg-gray-50 rounded-lg pt-4' : 'w-72'}`}
                            >
                                {/* Column Header */}
                                {section.id === 'postpone' ? (
                                    <div className="h-full flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mb-6"></div>
                                        <div className="rotate-90 text-sm font-semibold text-gray-500 whitespace-nowrap tracking-wide origin-center translate-y-8">
                                            {section.title} <span className="ml-2 font-normal">{section.count}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                                        <h3 className="font-semibold text-gray-800">{section.title}</h3>
                                        <span className="text-gray-400 text-sm">{section.count}</span>
                                        <div className="ml-auto flex gap-2 text-gray-400">
                                            <FaPlus size={12} className="cursor-pointer hover:text-gray-600" />
                                            <FaEllipsisH size={12} className="cursor-pointer hover:text-gray-600" />
                                        </div>
                                    </div>
                                )}

                                {/* Tasks Container */}
                                {section.id !== 'postpone' && (
                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                        {section.tasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
                                            >
                                                <h4 className="text-sm font-medium text-gray-800 mb-2 leading-tight">{task.name}</h4>

                                                {/* Labels */}
                                                {(task.label?.length || 0) > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {task.label?.map((lbl, i) => (
                                                            <span
                                                                key={i}
                                                                className={`px-1.5 py-0.5 text-[10px] font-medium rounded 
                                                                    ${lbl === 'design' ? 'bg-blue-50 text-blue-600' :
                                                                        lbl === 'bug' ? 'bg-red-50 text-red-600' :
                                                                            lbl === 'API' ? 'bg-orange-50 text-orange-600' :
                                                                                lbl === 'plan' ? 'bg-yellow-50 text-yellow-600' :
                                                                                    'bg-gray-100 text-gray-600'}`}
                                                            >
                                                                {lbl}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        {task.assignee && (
                                                            <div className="flex items-center gap-1.5">
                                                                <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full" />
                                                                <span className="text-xs text-gray-500">{task.assignee.name}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3 text-gray-400">
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
                                                            <div className="text-[10px] text-gray-400">
                                                                {task.dueDate}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add Task Button */}
                                        <button
                                            onClick={() => handleAddTask("New Task", section.id)}
                                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm py-1 w-full"
                                        >
                                            <FaPlus size={12} /> Add task
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Section Button */}
                        <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium pt-1 whitespace-nowrap">
                            <FaPlus size={12} /> Add section
                        </button>
                    </div>
                ) : activeView === 'Calendar' ? (
                    // Calendar View Content
                    <div className="flex flex-col h-full min-w-[800px]">
                        {/* Calendar Controls */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-800">October 2024</h2>
                                <FaChevronDown size={12} className="text-gray-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button className="px-3 py-1 text-sm text-gray-600 bg-white hover:bg-gray-50 border-r border-gray-300">Month</button>
                                    <button className="px-3 py-1 text-sm text-gray-600 bg-white hover:bg-gray-50">Today</button>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 ml-2">
                                    <button className="p-1 hover:text-gray-600"><FaChevronLeft size={14} /></button>
                                    <button className="p-1 hover:text-gray-600"><FaChevronRight size={14} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200 text-center py-2 bg-white">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="text-xs font-medium text-gray-500 uppercase">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="flex-1 grid grid-cols-7 grid-rows-5">
                                {Array.from({ length: 35 }).map((_, i) => {
                                    // Logic to start from Oct 2024 context (starts roughly)
                                    // Mocking visual layout: 28th starts previous month
                                    let dayNum = i - 3; // Offset to start 28, 29, 30, 31, 1...
                                    let isCurrentMonth = true;

                                    if (dayNum < 1) {
                                        dayNum = 31 + dayNum; // Previous month dates
                                        isCurrentMonth = false;
                                    } else if (dayNum > 31) {
                                        dayNum = dayNum - 31; // Next month dates
                                        isCurrentMonth = false;
                                    }

                                    const isToday = isCurrentMonth && dayNum === 13;
                                    const events = calendarEvents.filter(e => e.date === dayNum && isCurrentMonth);

                                    return (
                                        <div key={i} className={`border-b border-r border-gray-100 p-2 relative ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}`}>
                                            <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full mb-1
                                                ${!isCurrentMonth ? 'text-gray-400' : isToday ? 'bg-blue-500 text-white font-bold shadow-sm' : 'text-gray-700'}`}>
                                                {dayNum}
                                            </span>

                                            <div className="space-y-1">
                                                {events.map((event, idx) => (
                                                    <div
                                                        key={`${event.id}-${idx}`}
                                                        onClick={(e) => { e.stopPropagation(); /* Mocking task selection from calendar */ setSelectedTask({ id: event.id, name: event.title, status: 'In progress' } as Task); }}
                                                        className={`text-[10px] px-2 py-1 rounded truncate shadow-sm cursor-pointer hover:opacity-80 transition-opacity ${event.color}`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Table View Content
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
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
                                        <FaChevronRight className="text-gray-400 group-hover:text-gray-600" size={12} />
                                    ) : (
                                        <FaChevronDown className="text-gray-400 group-hover:text-gray-600" size={12} />
                                    )}
                                    <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                                    <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
                                    <span className="text-xs text-gray-500">{section.count}</span>
                                    <FaEllipsisH className="text-gray-400 opacity-0 group-hover:opacity-100 ml-2" size={12} />
                                    <FaPlus className="text-gray-400 opacity-0 group-hover:opacity-100 ml-1" size={12} />
                                </div>

                                {/* Tasks */}
                                {!collapsedSections.includes(section.id) && (
                                    <div className="space-y-1">
                                        {section.tasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 hover:bg-gray-50 items-center text-sm group cursor-pointer"
                                            >
                                                <div className="col-span-6 flex items-center gap-3 pl-2">
                                                    <FaCheckCircle className="text-gray-300 hover:text-green-500 cursor-pointer" />
                                                    <span className="text-gray-900 font-medium truncate">{task.name}</span>
                                                    <div className="flex items-center gap-2 text-gray-400">
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
                                                        <FaStream className="opacity-0 group-hover:opacity-100" size={10} />
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {task.assignee ? (
                                                        <>
                                                            <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full" />
                                                            <span className="text-gray-600 text-xs">{task.assignee.name}</span>
                                                        </>
                                                    ) : (
                                                        <FaUserCircle className="text-gray-300 opacity-0 group-hover:opacity-100" size={20} />
                                                    )}
                                                </div>
                                                <div className="col-span-2 text-gray-600 text-xs">
                                                    {task.dueDate || ''}
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {task.label?.map((lbl, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`px-2 py-0.5 rounded text-xs font-medium 
                                                        ${lbl === 'design' ? 'bg-blue-100 text-blue-700' :
                                                                    lbl === 'bug' ? 'bg-red-100 text-red-700' :
                                                                        lbl === 'mobile' ? 'bg-orange-100 text-orange-700' :
                                                                            lbl === 'API' ? 'bg-amber-100 text-amber-700' :
                                                                                lbl === 'plan' ? 'bg-yellow-100 text-yellow-700' :
                                                                                    'bg-gray-100 text-gray-700'}`}
                                                        >
                                                            {lbl}
                                                        </span>
                                                    ))}
                                                    <FaPlus className="text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer ml-auto" size={10} />
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add Task Row */}
                                        <div className="flex items-center gap-3 py-2 pl-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                            <FaPlus size={12} />
                                            <span className="text-sm">Add task</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
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
