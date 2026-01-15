import React from 'react';
import CreateGlobalTaskModal from '../../../components/modals/createTask/CreateGlobalTaskModal';
import TaskDetailPanel from '../../../components/dashboard/TaskDetailPanel';
import { useTasks } from './useTasks';
import { useAppSelector } from 'store/hooks';
import { RootState } from 'store/store';
import {
  FaSearch,
  FaPlus,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaEllipsisH,
  FaPaperclip,
  FaFlag,
  FaRegCommentDots,
  FaRegFileAlt,
} from 'react-icons/fa';
import { MdSettingsInputComponent } from 'react-icons/md';
import { Loader } from 'components/loader/Loader';

const Tasks: React.FC = () => {
  const {
    tasks,
    loading,
    viewMode,
    isCreateModalOpen,
    searchTerm,
    filteredTasks,
    columns,
    handleDragEnd,
    setViewMode,
    setIsCreateModalOpen,
    setSearchTerm,
    selectedTask,
    setSelectedTask,
    DragDropContext,
    Droppable,
    Draggable,
  } = useTasks();
  const { user } = useAppSelector((state: RootState) => state.auth);

  if (loading && tasks.length === 0) {
    return <Loader fullscreen={false} />;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-surface-dark overflow-hidden">
      <header className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark">
        <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight text-center sm:text-left">
            Tasks
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 w-full">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'KANBAN' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <FaThLarge /> <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'LIST' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <FaList /> <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-48 md:w-64 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <MdSettingsInputComponent size={12} /> <span className="hidden md:inline">Filters</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <FaSortAmountDown size={12} /> <span className="hidden md:inline">Sort By</span>
              </button>

              {user?.role === 'MANAGER' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200"
                >
                  <FaPlus size={12} /> New Task
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-[#0f1117]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full gap-4 sm:gap-6 min-w-max pb-4">
            {columns.map((col) => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`w-[270px] flex-shrink-0 flex flex-col h-full transition-colors duration-200 rounded-xl 
                                            ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4 px-1 pt-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">{col.title}</h3>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {col.items.length}
                        </span>
                      </div>
                      <div className="flex gap-2 text-gray-400 dark:text-gray-600">
                        {user?.role === 'MANAGER' && (
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="hover:text-gray-500 dark:hover:text-gray-400"
                          >
                            <FaPlus size={12} />
                          </button>
                        )}
                        <button className="hover:text-gray-500 dark:hover:text-gray-400">
                          <FaEllipsisH size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar scroll-smooth">
                      {col.items.map((task, index) => {
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
                                className={`bg-white dark:bg-surface-card p-5 rounded-2xl border shadow-sm transition-all cursor-pointer group mb-3
                                                                ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-gray-800 hover:shadow-md'}`}
                                onClick={() => setSelectedTask(task)}
                              >
                                <div className="flex justify-between items-center mb-4">
                                  <span className="px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/40 rounded-md border border-blue-100/50 dark:border-blue-900/30">
                                    {task.project?.name || 'Internal'}
                                  </span>
                                  <button className="text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                                    <FaEllipsisH size={14} />
                                  </button>
                                </div>

                                <div className="mb-4">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight tracking-tight">
                                    {task.name}
                                  </h4>
                                  <p className="text-sm text-content-muted-alt dark:text-content-muted-alt line-clamp-2 leading-normal">
                                    {task.description || 'No description provided.'}
                                  </p>
                                </div>

                                <div className="space-y-2 mb-5">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-[10px] text-gray-400 dark:text-gray-500  tracking-wider font-semibold">
                                      Assignee:
                                    </div>
                                    <div className="flex-shrink-0 ">
                                      {task.assignedTo ? (
                                        <img
                                          src={
                                            task.assignedTo.avatar ||
                                            'https://ui-avatars.com/api/?name=' +
                                            task.assignedTo.name
                                          }
                                          alt={task.assignedTo.name}
                                          className="w-5 h-5 rounded-full"
                                        />
                                      ) : (
                                        <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400"></div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm font-medium">
                                      <FaFlag
                                        size={14}
                                        className="text-gray-600 dark:text-gray-400"
                                      />
                                      <span className="text-[#74798B] font-normal">
                                        {task.dueDate
                                          ? new Date(task.dueDate).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                          })
                                          : 'No Deadline'}
                                      </span>
                                    </div>

                                    <div
                                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider
                                                                        ${task.priority === 'HIGH'
                                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30'
                                          : task.priority ===
                                            'LOW'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100/50 dark:border-green-900/30'
                                            : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100/50 dark:border-yellow-900/30'
                                        }`}
                                    >
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-600' : task.priority === 'LOW' ? 'bg-green-600' : 'bg-yellow-600'}`}
                                      />
                                      {task.priority || 'Medium'}
                                    </div>
                                  </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800 -mx-5 mb-4" />

                                <div className="flex items-center gap-5 text-gray-400 dark:text-gray-500">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <FaRegFileAlt size={16} className="text-gray-600" />
                                    <span className="text-sm font-semibold text-content-muted-alt">
                                      {task.subtasks
                                        ? `${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length}`
                                        : '0/0'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <FaRegCommentDots size={16} className="text-gray-600" />
                                    <span className="text-sm font-semibold text-content-muted-alt">
                                      {task.comments || 0}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <FaPaperclip size={16} className="text-gray-600 -rotate-45" />
                                    <span className="text-sm font-semibold text-content-muted-alt">
                                      {task.attachments || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}

                      {user?.role === 'MANAGER' && (
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="w-full py-2 bg-transparent border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                          <FaPlus size={10} /> New Task
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      <CreateGlobalTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default Tasks;
