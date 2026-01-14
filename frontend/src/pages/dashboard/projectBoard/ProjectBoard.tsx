import React, { useState } from 'react';
import {
  FaStar,
  FaEllipsisH,
  FaSearch,
  FaFilter,
  FaSort,
  FaList,
  FaTh,
  FaCalendarAlt,
  FaStream,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaRegCheckCircle,
  FaRegComment,
  FaPaperclip,
  FaUserCircle,
  FaTimes,
  FaBell,
  FaThLarge,
  FaUserPlus,
  FaLayerGroup,
  FaTable,
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateProjectModal from '../../../components/modals/createProjectModal/CreateProjectModal';
import { useProjectBoard } from './useProject';
import { useAppSelector } from '../../../store/hooks';
import { TaskStatus, CalendarEvent } from 'types';
import CreateEventModal from '../../../components/modals/createEventModal/CreateEventModal';
import CreateGlobalTaskModal from '../../../components/modals/createTask/CreateGlobalTaskModal';
import { MdChatBubbleOutline } from 'react-icons/md';

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
    handlePrevDay,
    handleNextDay,
    handleGoToToday,
    currentProject,
    projects,
    selectedProjectId,
    handleProjectChange,
    meetings,
    searchQuery,
    setSearchQuery,
    visibleSectionIds,
    toggleSectionVisibility,
    ALL_SECTIONS,
  } = useProjectBoard();

  const { user } = useAppSelector((state) => state.auth);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState<TaskStatus | undefined>(undefined);

  const today = new Date();

  const getLabelStyles = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('design'))
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (l.includes('dev') || l.includes('code') || l.includes('frontend') || l.includes('backend'))
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    if (l.includes('bug') || l.includes('fix') || l.includes('issue'))
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (l.includes('feat') || l.includes('feature'))
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
    if (l.includes('plan') || l.includes('marketing'))
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    if (l.includes('api'))
      return 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark">
      <header className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {currentProject?.name || 'Project Board'}
              </h1>
              <FaStar className="text-yellow-400 cursor-pointer" />
              <div className="relative">
                <FaEllipsisH
                  className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
                />

                {isProjectSelectorOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProjectSelectorOpen(false)}
                    ></div>
                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-surface-card ring-1 ring-black ring-opacity-5 z-20 overflow-hidden border border-gray-100 dark:border-gray-800">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                          Switch Project
                        </div>
                        <button
                          onClick={() => {
                            handleProjectChange('all');
                            setIsProjectSelectorOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${selectedProjectId === 'all'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                            }`}
                        >
                          All Projects
                          {selectedProjectId === 'all' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                          )}
                        </button>
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              handleProjectChange(project.id);
                              setIsProjectSelectorOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${selectedProjectId === project.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                              }`}
                          >
                            <span className="truncate">{project.name}</span>
                            {selectedProjectId === project.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
            <div className="flex -space-x-2">
              {(currentProject?.team?.members || []).slice(0, 2).map((member) => (
                <img
                  key={member.user.id}
                  src={
                    member.user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=random`
                  }
                  alt={member.user.name}
                  title={member.user.name}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
              ))}
              {(currentProject?.team?.members?.length || 0) > 2 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                  +{(currentProject?.team?.members?.length || 0) - 2}
                </div>
              )}
              {(currentProject?.team?.members?.length || 0) === 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/50 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <FaUserCircle className="text-gray-300 dark:text-gray-600" size={20} />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                Share
              </button>
              {user?.role === 'MANAGER' && (
                <button
                  onClick={() => {
                    setInitialTaskStatus('TODO');
                    setIsTaskModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  Create Task
                  <FaPlus size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 min-w-max">
            {['Board', 'Table', 'Calendar', 'Timeline'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${activeView === view ? 'border-gray-800 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                {view === 'Board' && <FaTh size={14} />}
                {view === 'Table' && <FaTable size={14} />}
                {view === 'Calendar' && <FaCalendarAlt size={14} />}
                {view === 'Timeline' && <FaStream size={14} />}
                {view}
              </button>
            ))}
            {user?.role === 'MANAGER' && (
              <button
                onClick={() => {
                  setInitialTaskStatus('TODO');
                  setIsTaskModalOpen(true);
                }}
                className="flex items-center gap-2 pb-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FaPlus size={12} /> Add Task
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 min-w-max md:w-auto">
            {isSearchExpanded || searchQuery ? (
              <div className="relative group">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  size={14}
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search tasks or events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setIsSearchExpanded(false);
                  }}
                  className="pl-9 pr-8 py-1.5 w-40 sm:w-64 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-750 focus:border-blue-500/50 border rounded-full text-xs text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchExpanded(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => setIsSearchExpanded(true)}
                className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
              >
                <FaSearch size={14} /> <span className="hidden sm:inline">Search</span>
              </div>
            )}
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
      <div className="flex-1 overflow-auto bg-white dark:bg-surface-dark p-6">
        {activeView === 'Board' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex items-start h-full gap-6 min-w-max">
              {sections.map((section) => (
                <Droppable key={section.id} droppableId={section.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-col h-full transition-colors duration-200 
                                                ${section.id === 'postpone' ? 'w-10 items-center rounded-lg pt-4' : 'w-72'}
                                                ${snapshot.isDraggingOver ? (section.id === 'postpone' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50/50 dark:bg-blue-900/10') : section.id === 'postpone' ? 'bg-gray-50 dark:bg-surface-card' : ''}`}
                    >
                      {section.id === 'postpone' ? (
                        <div className="flex-1 flex flex-col items-center pointer-events-none">
                          <div className="w-2 h-2 rounded-full bg-red-500 mb-6 font-bold"></div>
                          <div className="rotate-90 text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap tracking-wide origin-center translate-y-8">
                            {section.title}{' '}
                            <span className="ml-2 font-normal">{section.count}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-4 px-1">
                            <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                              {section.title}
                            </h3>
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              {section.count}
                            </span>
                            <div className="ml-auto flex gap-2 text-gray-400 dark:text-gray-500">
                              {user?.role === 'MANAGER' && (
                                <FaPlus
                                  size={12}
                                  className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                                  onClick={() => {
                                    const statusMap: Record<string, TaskStatus> = {
                                      backlog: 'TODO',
                                      inprogress: 'IN_PROGRESS',
                                      qa: 'COMPLETED',
                                      postpone: 'CANCELED',
                                    };
                                    setInitialTaskStatus(statusMap[section.id] || 'TODO');
                                    setIsTaskModalOpen(true);
                                  }}
                                />
                              )}
                              <FaEllipsisH
                                size={12}
                                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                              />
                            </div>
                          </div>

                          {/* Tasks List */}
                          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {section.tasks.map((task, index) => {
                              const isDragDisabled =
                                user?.role !== 'MANAGER' && task.assignedTo?.id !== user?.id;
                              return (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={index}
                                  isDragDisabled={isDragDisabled}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setSelectedTask(task)}
                                      className={`bg-white dark:bg-surface-card p-5 rounded-2xl border shadow-sm transition-all cursor-pointer group mb-3
                                                                ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-gray-800 hover:shadow-md'}`}
                                    >
                                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2 leading-tight">
                                        {task.name}
                                      </h4>

                                      {/* Labels */}
                                      {(task.label?.length || 0) > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {task.label?.map((lbl, i) => (
                                            <span
                                              key={i}
                                              className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getLabelStyles(lbl)}`}
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
                                              <img
                                                src={
                                                  task.assignedTo.avatar ||
                                                  'https://ui-avatars.com/api/?name=' +
                                                  task.assignedTo.name
                                                }
                                                alt={task.assignedTo.name}
                                                className="w-5 h-5 rounded-full"
                                              />
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {task.assignedTo.name}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                                          {task.comments && (
                                            <div className="flex items-center gap-1 text-xs">
                                              <MdChatBubbleOutline size={14} /> {task.comments}
                                            </div>
                                          )}
                                          {task.attachments && (
                                            <div className="flex items-center gap-1 text-xs">
                                              <FaPaperclip size={10} /> {task.attachments}
                                            </div>
                                          )}
                                          {task.dueDate && (
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                              {new Date(task.dueDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                            {/* Add Task Button */}
                            {user?.role === 'MANAGER' && (
                              <button
                                onClick={() => {
                                  const statusMap: Record<string, TaskStatus> = {
                                    backlog: 'TODO',
                                    inprogress: 'IN_PROGRESS',
                                    qa: 'COMPLETED',
                                    postpone: 'CANCELED',
                                  };
                                  setInitialTaskStatus(statusMap[section.id] || 'TODO');
                                  setIsTaskModalOpen(true);
                                }}
                                className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm py-1 w-full transition-colors"
                              >
                                <FaPlus size={12} /> Add task
                              </button>
                            )}
                          </div>
                        </>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}

              {/* Add Section Button */}
              {user?.role === 'MANAGER' && (
                <div className="relative">
                  <button
                    onClick={() => setIsAddSectionOpen(!isAddSectionOpen)}
                    className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium pt-1 whitespace-nowrap transition-colors"
                  >
                    <FaPlus size={12} /> Add section
                  </button>

                  {isAddSectionOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsAddSectionOpen(false)}
                      ></div>
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-xl bg-white dark:bg-surface-card ring-1 ring-black ring-opacity-5 z-20 overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                          Manage Sections
                        </div>
                        <div className="py-1">
                          {ALL_SECTIONS.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => toggleSectionVisibility(section.id)}
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${section.color}-500`}></div>
                                {section.title}
                              </div>
                              {visibleSectionIds.includes(section.id) && (
                                <FaRegCheckCircle className="text-blue-500" size={14} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
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
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-r border-gray-300 dark:border-gray-700">
                    Month
                  </button>
                  <button
                    onClick={handleGoToToday}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 ml-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 border border-gray-100 dark:border-gray-800/10 rounded-xl overflow-hidden flex flex-col bg-white dark:bg-surface-dark shadow-sm">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-gray-50 dark:border-gray-800/10 py-3 bg-gray-50/50 dark:bg-gray-900/10">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div
                    key={day}
                    className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="flex-1 grid grid-cols-7">
                {calendarDays.map((cell, i) => {
                  const dayNum = cell.day;
                  const isCurrentMonth = cell.isCurrentMonth;
                  const isToday =
                    dayNum === today.getDate() &&
                    cell.month === today.getMonth() &&
                    cell.year === today.getFullYear();
                  const events = calendarEvents.filter(
                    (e) => e.date === dayNum && e.month === cell.month && e.year === cell.year
                  );

                  return (
                    <div
                      key={i}
                      className={`border-b border-r border-gray-50 dark:border-gray-800/10 p-2.5 relative min-h-[180px] hover:bg-gray-50/20 dark:hover:bg-gray-800/5 transition-colors flex flex-col ${!isCurrentMonth ? 'bg-gray-50/20 dark:bg-gray-900/5' : 'bg-white dark:bg-surface-dark'}`}
                    >
                      <div className="flex justify-end mb-2.5">
                        <span
                          className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all
                                                                ${!isCurrentMonth ? 'text-gray-200 dark:text-gray-800' : isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 dark:text-gray-600'}`}
                        >
                          {dayNum}
                        </span>
                      </div>

                      <div className="space-y-1.5 overflow-y-auto no-scrollbar pb-1">
                        {events.map((event, idx) => (
                          <div
                            key={`${event.id}-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(event.task);
                            }}
                            className={`px-2 py-1 rounded shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${event.color} flex flex-col min-w-0`}
                          >
                            <div className="text-[10px] font-bold leading-tight truncate">
                              {event.title}
                            </div>
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
          <div className="min-w-[900px] overflow-x-auto pb-20">
            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} className="group/section">
                {/* Section Header */}
                <div className="flex items-center gap-2 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                  >
                    {collapsedSections.includes(section.id) ? (
                      <FaChevronRight size={10} />
                    ) : (
                      <FaChevronDown size={10} />
                    )}
                  </button>

                  <div
                    className={`w-2 h-2 rounded-full ${section.id === 'postpone'
                      ? 'bg-red-400'
                      : section.id === 'qa'
                        ? 'bg-green-400'
                        : section.id === 'inprogress'
                          ? 'bg-blue-400'
                          : 'bg-gray-400'
                      }`}
                  ></div>

                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                  <span className="text-xs text-gray-400">{section.count}</span>

                  <div className="flex items-center gap-2 ml-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <FaEllipsisH size={10} />
                    </button>
                    {user?.role === 'MANAGER' && (
                      <button
                        onClick={() => {
                          const statusMap: Record<string, TaskStatus> = {
                            backlog: 'TODO',
                            inprogress: 'IN_PROGRESS',
                            qa: 'COMPLETED',
                            postpone: 'CANCELED',
                          };
                          setInitialTaskStatus(statusMap[section.id] || 'TODO');
                          setIsTaskModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FaPlus size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                {!collapsedSections.includes(section.id) && (
                  <>
                    {/* Table Header inside Section */}
                    <div className="flex items-center border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-sidebar text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      <div className="flex-1 min-w-[300px] pl-8 py-2 border-r border-gray-200 dark:border-gray-800">
                        Name
                      </div>
                      <div className="w-40 py-2 pl-4 border-r border-gray-200 dark:border-gray-800">
                        Assignee
                      </div>
                      <div className="w-32 py-2 pl-4 border-r border-gray-200 dark:border-gray-800">
                        Due date
                      </div>
                      <div className="w-40 py-2 pl-4 border-r border-gray-200 dark:border-gray-800">
                        Label
                      </div>
                      <div className="w-10 text-center py-2">+</div>
                    </div>
                    {section.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 group/row cursor-pointer text-sm"
                      >
                        {/* Name Column */}
                        <div className="flex-1 min-w-[300px] flex items-center gap-3 pl-4 pr-4 py-2 border-r border-gray-100 dark:border-gray-800/50">
                          <div className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                            <FaRegCheckCircle size={16} />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 truncate">
                            {task.name}
                          </span>

                          {/* Icons inline with name */}
                          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                            {task.comments && (
                              <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                <FaRegComment size={10} /> {task.comments}
                              </div>
                            )}
                            {task.attachments && (
                              <div className="flex items-center gap-1 text-xs">
                                <FaPaperclip size={10} /> {task.attachments}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assignee Column */}
                        <div className="w-40 flex items-center text-sm py-2 pl-4 border-r border-gray-100 dark:border-gray-800/50">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  task.assignedTo.avatar ||
                                  'https://ui-avatars.com/api/?name=' + task.assignedTo.name
                                }
                                alt={task.assignedTo.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-gray-600 dark:text-gray-400 text-xs truncate max-w-[100px]">
                                {task.assignedTo.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 text-xs">-</span>
                          )}
                        </div>

                        {/* Due Date Column */}
                        <div className="w-32 text-xs text-gray-500 dark:text-gray-400 py-2 pl-4 border-r border-gray-100 dark:border-gray-800/50">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })
                            : '-'}
                        </div>

                        {/* Labels Column */}
                        <div className="w-40 flex flex-wrap gap-1.5 py-2 pl-4 border-r border-gray-100 dark:border-gray-800/50">
                          {task.label?.map((lbl, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 text-[11px] rounded ${getLabelStyles(lbl)}`}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>

                        {/* Action Column */}
                        <div className="w-10 flex justify-center opacity-0 group-hover/row:opacity-100 transition-opacity py-2">
                          {user?.role === 'MANAGER' && (
                            <FaPlus
                              className="text-gray-400 hover:text-gray-600 cursor-pointer"
                              size={10}
                              onClick={(e) => {
                                e.stopPropagation();
                                const statusMap: Record<string, TaskStatus> = {
                                  backlog: 'TODO',
                                  inprogress: 'IN_PROGRESS',
                                  qa: 'COMPLETED',
                                  postpone: 'CANCELED',
                                };
                                setInitialTaskStatus(statusMap[section.id] || 'TODO');
                                setIsTaskModalOpen(true);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}

                    {/* New Task Input Placeholder */}
                    {user?.role === 'MANAGER' && (
                      <div
                        className="flex items-center gap-3 px-4 py-2 opacity-0 group-hover/section:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          const statusMap: Record<string, TaskStatus> = {
                            backlog: 'TODO',
                            inprogress: 'IN_PROGRESS',
                            qa: 'COMPLETED',
                            postpone: 'CANCELED',
                          };
                          setInitialTaskStatus(statusMap[section.id] || 'TODO');
                          setIsTaskModalOpen(true);
                        }}
                      >
                        <FaPlus size={12} />
                        <span className="text-sm">New</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-surface-dark">
            {/* Timeline Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                </h2>
                {(() => {
                  const count = meetings.filter((m: CalendarEvent) => {
                    const mDate = new Date(m.startTime);
                    return (
                      mDate.getFullYear() === currentDate.getFullYear() &&
                      mDate.getMonth() === currentDate.getMonth() &&
                      mDate.getDate() === currentDate.getDate()
                    );
                  }).length;
                  return count > 0 ? (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-200 dark:border-blue-800/50">
                      {count} {count === 1 ? 'Meeting' : 'Meetings'}
                    </span>
                  ) : null;
                })()}
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={handlePrevDay}
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={handleNextDay}
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoToToday}
                  className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:shadow-md transition-all active:scale-95 shadow-sm"
                >
                  Today
                </button>
                <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 shadow-sm">
                  8:00 - 17:00
                </div>
                {user?.role === 'MANAGER' && (
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-all shadow-md active:scale-95"
                  >
                    <FaPlus size={10} />
                    Add Event
                  </button>
                )}
              </div>
            </div>

            {/* Hourly Timeline Grid Wrapper - Clean & Responsive */}
            <div className="flex-1 mt-2">
              <div className="flex flex-col w-full bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden">
                {/* Hours Label Bar */}
                <div className="flex bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const hour = 8 + i;
                    return (
                      <div key={hour} className="flex-1 py-3 text-center">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-tighter">
                          {hour}:00
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Timeline Body Area */}
                <div className="relative flex-1 bg-white dark:bg-surface-dark">
                  {/* Horizontal Grid Lines - Removed for minimalism */}
                  <div className="absolute inset-0 flex opacity-0">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex-1"></div>
                    ))}
                  </div>

                  {/* Task Rows Area */}
                  <div className="relative p-6 space-y-4">
                    {(() => {
                      // Robust date comparison helper
                      const isSameDay = (d1: Date, d2: Date) => {
                        return (
                          d1.getFullYear() === d2.getFullYear() &&
                          d1.getMonth() === d2.getMonth() &&
                          d1.getDate() === d2.getDate()
                        );
                      };

                      // Filter meetings for the current selected date
                      const timelineMeetings = meetings.filter((m: CalendarEvent) => {
                        const mDate = new Date(m.startTime);
                        return isSameDay(mDate, currentDate);
                      });

                      if (meetings.length > 0 && timelineMeetings.length === 0) {
                        console.log(
                          'Sample Meetings in State:',
                          meetings.map((m: CalendarEvent) => ({
                            title: m.title,
                            start: new Date(m.startTime).toDateString(),
                          }))
                        );
                      }

                      const processedMeetings = timelineMeetings.map((meeting: CalendarEvent) => {
                        const start = new Date(meeting.startTime);
                        const end = new Date(meeting.endTime);

                        const startHour = start.getHours() + start.getMinutes() / 60;
                        const endHour = end.getHours() + end.getMinutes() / 60;
                        const duration = endHour - startHour;

                        return {
                          meeting,
                          visual: { start: startHour, end: endHour, duration },
                        };
                      });

                      interface ProcessedMeeting {
                        meeting: CalendarEvent;
                        visual: { start: number; end: number; duration: number };
                      }

                      const sortedMeetings = processedMeetings.sort(
                        (a, b) => a.visual.start - b.visual.start
                      );
                      const rows = sortedMeetings.map((pm) => [pm]);

                      if (rows.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <FaCalendarAlt size={32} className="mb-2 opacity-20" />
                            <p className="text-sm">No meetings scheduled for this day</p>
                          </div>
                        );
                      }

                      return rows.map((row: ProcessedMeeting[], rowIndex: number) => (
                        <div key={rowIndex} className="relative h-24 w-full">
                          {row.map((pm: ProcessedMeeting) => {
                            const { meeting, visual: v } = pm;
                            const leftPercent = ((v.start - 8) / 10) * 100;
                            const widthPercent = (v.duration / 10) * 100;

                            const typeColors: Record<string, string> = {
                              MEETING:
                                'bg-orange-50/70 border-orange-400 text-orange-900 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
                              DEADLINE:
                                'bg-rose-50/70 border-rose-400 text-rose-900 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700',
                              EVENT:
                                'bg-green-50/70 border-green-400 text-green-900 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
                            };
                            const colorStyle =
                              typeColors[meeting.type] ||
                              'bg-blue-50/70 border-blue-400 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';

                            return (
                              <div
                                key={meeting.id}
                                className={`absolute top-0 h-16 px-5 flex flex-col justify-center rounded-2xl border-l-[8px] shadow-sm hover:shadow-lg transition-all cursor-pointer group ${colorStyle}`}
                                style={{
                                  left: `${Math.max(0, leftPercent)}%`,
                                  width: `calc(${Math.max(8, Math.min(100 - leftPercent, widthPercent))}% - 12px)`,
                                  display: v.start >= 18 || v.end <= 8 ? 'none' : 'flex',
                                  minWidth: '140px',
                                }}
                              >
                                <div className="font-bold text-[13px] truncate leading-tight dark:opacity-95 mb-1">
                                  {meeting.title}
                                </div>
                                <div className="text-[11px] font-semibold opacity-60 tracking-tight">
                                  {new Date(meeting.startTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                  })}{' '}
                                  -{' '}
                                  {new Date(meeting.endTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
      <CreateGlobalTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialStatus={initialTaskStatus}
        initialProjectId={currentProject?.id}
      />
    </div>
  );
};

export default ProjectBoard;
