import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { useEffect, useMemo, useState } from 'react';
import { fetchProjects, setSelectedProjectId } from '../../../store/slices/projectSlice';
import { getTeams, fetchTeamMembersById, fetchTeamStats } from '../../../store/slices/teamSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useParams, useOutletContext } from 'react-router-dom';
import { fetchAllUsers } from '../../../store/slices/authSlice';
import { fetchKPIs, fetchRecentActivity } from '../../../store/slices/dashboardSlice';
import { fetchEvents } from '../../../store/slices/calendarSlice';
import { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { DashboardTask, CalendarEvent, Project, Team, Task } from 'types';

export const useTeamHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teamId: teamIdFromUrl } = useParams();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const { allTeams } = useSelector((state: RootState) => state.team);
  const { selectedProjectId, projects } = useSelector((state: RootState) => state.projects);
  useEffect(() => {
    dispatch(getTeams());
    dispatch(fetchProjects());
  }, [dispatch]);

  const team = (() => {
    if (teamIdFromUrl) return allTeams.find((t: Team) => t.id === teamIdFromUrl);
    if (selectedProjectId !== 'all') {
      const project = projects.find((p: Project) => p.id === selectedProjectId);
      if (project?.teamId) {
        return allTeams.find((t: Team) => t.id === project.teamId);
      }
    }
    return allTeams[0];
  })();

  return {
    team,
    isCreateTeamOpen,
    setIsCreateTeamOpen,
    allTeams,
  };
};

// =======ProjectTab Hooks=======

export const useProjectTabHook = () => {
  const { teamId: teamIdFromUrl } = useParams();
  const dispatch = useAppDispatch();
  const { projects, selectedProjectId, loading } = useAppSelector((state) => state.projects);
  const { allTeams } = useAppSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const { teamId: contextTeamId } = useOutletContext<{ teamId?: string }>();

  const teamId = (() => {
    if (contextTeamId) return contextTeamId;
    if (teamIdFromUrl) return teamIdFromUrl;
    if (selectedProjectId !== 'all') {
      const project = projects.find((p: Project) => p.id === selectedProjectId);
      if (project?.teamId) return project.teamId;
      return null;
    }
    return null; // Show all projects if 'all' is selected
  })();

  const filteredProjects = projects.filter((p: Project) => !teamId || p.teamId === teamId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
      case 'on hold':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
    }
  };

  const calculateProgress = (tasks?: { status: string }[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return {
    loading,
    allTeams,
    teamId,
    filteredProjects,
    getStatusColor,
    getPriorityColor,
    calculateProgress,
  };
};

//====== DashboardTab Hooks =======

export const useDashboardTabHook = () => {
  const { teamId: teamIdFromUrl } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    allTeams,
    stats: teamStats,
    loading: teamLoading,
  } = useSelector((state: RootState) => state.team);
  const { selectedProjectId, projects } = useSelector((state: RootState) => state.projects);
  const {
    kpis,
    recentActivity,
    loading: dashLoading,
  } = useSelector((state: RootState) => state.dashboard);
  const { events, loading: calendarLoading } = useSelector((state: RootState) => state.calendar);
  const [selectedYear, setSelectedYear] = useState('2026');
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === 'dark';

  const { teamId: contextTeamId } = useOutletContext<{ teamId?: string }>();

  const teamId = (() => {
    if (contextTeamId) return contextTeamId;
    if (teamIdFromUrl) return teamIdFromUrl;
    if (selectedProjectId !== 'all') {
      const project = projects.find((p: Project) => p.id === selectedProjectId);
      if (project?.teamId) return project.teamId;
      return null;
    }
    return null;
  })();

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamStats({ teamId, year: selectedYear }));
    }

    const projectIdForEvents =
      selectedProjectId && selectedProjectId !== 'all' ? selectedProjectId : undefined;
    dispatch(fetchEvents({ projectId: projectIdForEvents }));

    if (selectedProjectId && selectedProjectId !== 'all') {
      dispatch(fetchKPIs({ projectId: selectedProjectId, year: selectedYear }));
      dispatch(fetchRecentActivity(selectedProjectId));
    } else if (!teamId) {
      dispatch(fetchKPIs({ projectId: 'all', year: selectedYear }));
      dispatch(fetchRecentActivity('all'));
    }
  }, [dispatch, teamId, selectedProjectId, selectedYear]);

  const loading = teamLoading || dashLoading;

  const mappedGlobalStats = useMemo(() => {
    if (!kpis) return null;
    return {
      stats: [
        {
          title: 'Completed tasks',
          value: kpis.tasks.completed,
          meta: `${kpis.tasks.total > 0 ? ((kpis.tasks.completed / kpis.tasks.total) * 100).toFixed(2) : 0}%`,
        },
        {
          title: 'Incompleted tasks',
          value: kpis.tasks.total - kpis.tasks.completed,
          meta: `${kpis.tasks.total > 0 ? (((kpis.tasks.total - kpis.tasks.completed) / kpis.tasks.total) * 100).toFixed(2) : 0}%`,
        },
        { title: 'Overdue tasks', value: kpis.tasks.overdue || 0, meta: 'Overdue' },
        {
          title: 'Total Income',
          value: `$${kpis.projects.totalBudget.toLocaleString()}`,
          meta: `${kpis.projects.totalBudget > 0 ? ((kpis.projects.totalSpent / kpis.projects.totalBudget) * 100).toFixed(2) : 0}% consumed`,
        },
      ],
      overview: {
        totalSpent: `$${kpis.projects.totalSpent.toLocaleString()}`,
        chartData: kpis.chartData || [],
      },
      topMembers: teamStats?.topMembers || [],
      topProjects: teamStats?.topProjects || [],
      recentActivities: recentActivity.map((a: DashboardTask) => ({
        id: a.id,
        name: a.name,
        updatedAt: a.updatedAt,
        status: a.status,
      })),
    };
  }, [kpis, recentActivity, teamStats]);

  const displayStats = useMemo(() => {
    if (selectedProjectId && selectedProjectId !== 'all') return mappedGlobalStats;
    if (teamId && teamStats) return teamStats;
    return mappedGlobalStats;
  }, [selectedProjectId, teamId, teamStats, mappedGlobalStats]);

  const chartData: ChartData<'bar'> | null = useMemo(() => {
    if (!displayStats?.overview?.chartData) return null;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const values = displayStats.overview.chartData.map((d: { value: number }) => d.value);

    const currentMonthIndex = new Date().getMonth();
    const isCurrentYear = selectedYear === new Date().getFullYear().toString();

    return {
      labels: months,
      datasets: [
        {
          data: values,
          backgroundColor: values.map((_: number, i: number) => {
            const shouldHighlight = isCurrentYear ? i === currentMonthIndex : i === 0;
            return shouldHighlight ? '#0070f3' : isDark ? '#2d333b' : '#e5e7eb';
          }),
          borderRadius: 8,
          barThickness: 32,
        },
      ],
    };
  }, [displayStats, isDark, selectedYear]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? '#1a1c23' : '#fff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context: { raw: unknown }) => `Tasks: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#4b5563' : '#9ca3af',
          font: {
            size: 11,
            weight: 500,
          },
          padding: 10,
        },
      },
    },
  };

  const hours = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const filteredTeamProjects = useMemo(() => {
    return projects.filter((p: Project) => !teamId || p.teamId === teamId);
  }, [projects, teamId]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    return events.filter((e: CalendarEvent) => {
      const eventDate = new Date(e.startTime);
      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    });
  }, [events]);

  const currentDateDisplay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    loading: loading || calendarLoading,
    allTeams,
    teamId,
    displayStats,
    chartData,
    chartOptions,
    hours,
    todayEvents,
    currentDateDisplay,
    filteredTeamProjects,
    setSelectedProjectId,
    selectedProjectId,
    selectedYear,
    setSelectedYear,
    dispatch,
  };
};

// ====== MemberTab Hooks =======

export const useMemberTabHook = () => {
  const { teamId: teamIdFromUrl } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { allTeams, members, loading: teamLoading } = useSelector((state: RootState) => state.team);
  const { selectedProjectId, projects } = useSelector((state: RootState) => state.projects);
  const { allUsers, loading: authLoading } = useSelector((state: RootState) => state.auth);

  const { teamId: contextTeamId } = useOutletContext<{ teamId?: string }>();

  const teamId = (() => {
    if (contextTeamId) return contextTeamId;
    if (teamIdFromUrl) return teamIdFromUrl;
    if (selectedProjectId !== 'all') {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project?.teamId) return project.teamId;
      return null;
    }
    return null;
  })();

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamMembersById(teamId));
    } else {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, teamId]);

  const displayMembers = teamId ? members : allUsers;
  const loading = teamLoading || authLoading;

  return {
    loading,
    allTeams,
    teamId,
    displayMembers,
  };
};
