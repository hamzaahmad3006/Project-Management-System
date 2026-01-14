import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchTasks,
  createTask as createTaskAction,
  updateTask,
  updateTaskStatusOptimistic,
  setSelectedTask as setSelectedTaskAction,
} from '../../../store/slices/taskSlice';
import { fetchProjects, setSelectedProjectId } from '../../../store/slices/projectSlice';
import { fetchEvents } from '../../../store/slices/calendarSlice';
import { Task, Section, TaskStatus, Project, CalendarEvent } from 'types';
import { AxiosError } from 'axios';
import { DropResult } from '@hello-pangea/dnd';

export const useProjectBoard = () => {
  const dispatch = useAppDispatch();
  const {
    tasks,
    loading: tasksLoading,
    error,
    currentTask: selectedTask,
  } = useAppSelector((state) => state.tasks);
  const {
    projects,
    currentProject: stateCurrentProject,
    selectedProjectId,
  } = useAppSelector((state) => state.projects);
  const { events: meetings, loading: calendarLoading } = useAppSelector((state) => state.calendar);

  const [activeView, setActiveView] = useState('Board');
  const [collapsedSections, setCollapsedSections] = useState<string[]>(['postpone', 'qa']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const setSelectedTask = (task: Task | null) => {
    dispatch(setSelectedTaskAction(task));
  };

  const currentProject = useMemo(() => {
    if (selectedProjectId === 'all') {
      return {
        id: 'all',
        name: 'All Projects',
        status: 'active',
        description: 'All tasks across all your projects',
        progress: 0,
        budget: 0,
        spent: 0,
        endDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teamId: '',
        managerId: '',
        startDate: new Date().toISOString(),
        manager: { id: '', name: 'System' },
        team: { id: '', name: 'All Teams', members: [] },
      } as Project;
    }
    if (selectedProjectId) {
      return projects.find((p: Project) => p.id === selectedProjectId) || stateCurrentProject;
    }
    return stateCurrentProject || (projects.length > 0 ? projects[0] : null);
  }, [projects, selectedProjectId, stateCurrentProject]);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }

    const projectIdToFetch =
      selectedProjectId && selectedProjectId !== 'all'
        ? selectedProjectId
        : selectedProjectId === 'all'
          ? undefined
          : currentProject?.id;

    dispatch(fetchTasks(projectIdToFetch ? { projectId: projectIdToFetch } : {}));

    dispatch(fetchEvents({}));
  }, [dispatch, currentProject?.id, selectedProjectId]);

  const handleAddTask = (taskName: string, sectionId: string) => {
    const activeProjectId =
      selectedProjectId && selectedProjectId !== 'all' ? selectedProjectId : currentProject?.id;

    if (!activeProjectId) {
      window.toastify('Please select a project first', 'error');
      return;
    }

    const newTaskData = {
      name: taskName,
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      sectionId: sectionId,
      projectId: activeProjectId,
    };
    dispatch(createTaskAction(newTaskData));
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const statusMap: Record<string, TaskStatus> = {
      backlog: 'TODO',
      inprogress: 'IN_PROGRESS',
      qa: 'COMPLETED',
      postpone: 'CANCELED',
    };

    const newStatus = statusMap[destination.droppableId];
    if (!newStatus) return;

    dispatch(updateTaskStatusOptimistic({ id: draggableId, status: newStatus }));

    try {
      await dispatch(
        updateTask({
          id: draggableId,
          data: { status: newStatus },
        })
      ).unwrap();
      window.toastify(`Task moved to ${destination.droppableId}`, 'success');
    } catch (err) {
      dispatch(fetchTasks(currentProject ? { projectId: currentProject.id } : {}));
      const errorMessage = typeof err === 'string' ? err : 'Failed to move task';
      window.toastify(errorMessage, 'error');
    }
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const dynamicSections = useMemo((): Section[] => {
    const filteredTasks = tasks.filter(
      (t: Task) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const backlogTasks = filteredTasks.filter((t: Task) => t.status === 'TODO');
    const inProgressTasks = filteredTasks.filter((t: Task) => t.status === 'IN_PROGRESS');
    const qaTasks = filteredTasks.filter((t: Task) => t.status === 'COMPLETED');
    const canceledTasks = filteredTasks.filter((t: Task) => t.status === 'CANCELED');

    return [
      {
        id: 'backlog',
        title: 'Backlog',
        count: backlogTasks.length,
        color: 'gray',
        tasks: backlogTasks,
      },
      {
        id: 'postpone',
        title: 'Postpone',
        count: canceledTasks.length,
        color: 'red',
        tasks: canceledTasks,
      },
      {
        id: 'inprogress',
        title: 'In progress',
        count: inProgressTasks.length,
        color: 'green',
        tasks: inProgressTasks,
      },
      {
        id: 'qa',
        title: 'QA',
        count: qaTasks.length,
        color: 'orange',
        tasks: qaTasks,
      },
    ];
  }, [tasks, searchQuery]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarEvents = useMemo(() => {
    const filteredTasks = tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredTasks.flatMap((t: Task) => {
      const events = [];
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      const assignDate = t.createdAt ? new Date(t.createdAt) : null;
      const projectName = t.project?.name || 'No Project';

      if (assignDate) {
        events.push({
          id: `${t.id}-assign`,
          title: projectName,
          taskName: t.name,
          date: assignDate.getUTCDate(),
          month: assignDate.getUTCMonth(),
          year: assignDate.getUTCFullYear(),
          type: 'assign',
          color: 'bg-green-100 text-green-600',
          task: t,
        });
      }

      if (dueDate) {
        events.push({
          id: `${t.id}-due`,
          title: projectName,
          taskName: t.name,
          date: dueDate.getUTCDate(),
          month: dueDate.getUTCMonth(),
          year: dueDate.getUTCFullYear(),
          type: 'due',
          color: 'bg-red-100 text-red-600',
          task: t,
        });
      }

      return events;
    });
  }, [tasks, searchQuery]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); //
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const offset = (firstDayOfMonth + 6) % 7;

    return Array.from({ length: 42 }).map((_, i) => {
      const date = new Date(year, month, i - offset + 1);
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month,
      };
    });
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevDay = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1)
    );
  };

  const handleNextDay = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
    );
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const handleProjectChange = (projectId: string) => {
    dispatch(setSelectedProjectId(projectId));
  };

  return {
    tasks,
    loading: tasksLoading || calendarLoading,
    error,
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
    sections: dynamicSections,
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
    meetings: meetings.filter((m: CalendarEvent) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    searchQuery,
    setSearchQuery,
  };
};
