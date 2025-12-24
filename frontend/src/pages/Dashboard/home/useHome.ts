import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchKPIs, fetchRecentActivity } from '../../../store/slices/dashboardSlice';
import { fetchProjects, setSelectedProjectId } from '../../../store/slices/projectSlice';


export const useHomeHook = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { kpis, recentActivity, loading: dashboardLoading } = useSelector((state: RootState) => state.dashboard);
    const { projects, selectedProjectId } = useSelector((state: RootState) => state.projects);
    const theme = useSelector((state: RootState) => state.theme.theme);

    const isDark = useMemo(() => {
        return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, [theme]);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchKPIs(selectedProjectId === 'all' ? undefined : selectedProjectId));
        dispatch(fetchRecentActivity(selectedProjectId === 'all' ? undefined : selectedProjectId));
    }, [dispatch, selectedProjectId]);

    const completionPercentage = useMemo(() => {
        return kpis?.tasks?.total
            ? Math.round((kpis.tasks.completed / kpis.tasks.total) * 100)
            : 0;
    }, [kpis]);

    const completionData = useMemo(() => ({
        datasets: [{
            data: [kpis?.tasks?.completed || 0, (kpis?.tasks?.total || 0) - (kpis?.tasks?.completed || 0)],
            backgroundColor: [isDark ? '#3b82f6' : '#1E3A8A', isDark ? '#1f2937' : '#E5E7EB'],
            borderWidth: 0,
        }]
    }), [kpis, isDark]);

    const budgetData = useMemo(() => ({
        labels: ['Total Budget', 'Total Spent'],
        datasets: [
            {
                label: 'Project Budget',
                data: [kpis?.projects?.totalBudget || 0, kpis?.projects?.totalSpent || 0],
                backgroundColor: [
                    isDark ? '#3b82f6' : '#1E3A8A',
                    kpis?.projects?.totalSpent && kpis.projects.totalSpent > kpis.projects.totalBudget ? '#ef4444' : '#10b981'
                ],
                borderRadius: 8,
                barThickness: 40,
            }
        ]
    }), [kpis, isDark]);

    const budgetOptions = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `$${context.raw.toLocaleString()}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    callback: (value: any) => `$${value.toLocaleString()}`
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                }
            }
        }
    }), [isDark]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'TODO': 'bg-blue-100 text-blue-700',
            'IN_PROGRESS': 'bg-orange-100 text-orange-700',
            'COMPLETED': 'bg-green-100 text-green-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            'HIGH': 'text-red-600',
            'MEDIUM': 'text-orange-600',
            'LOW': 'text-green-600',
        };
        return styles[priority] || 'text-gray-600';
    };

    const handleProjectChange = (projectId: string) => {
        dispatch(setSelectedProjectId(projectId));
    };

    const latestTasks = useMemo(() => recentActivity.slice(0, 4), [recentActivity]);

    return {
        kpis,
        projects,
        selectedProjectId,
        loading: dashboardLoading,
        isDark,
        completionPercentage,
        completionData,
        budgetData,
        budgetOptions,
        latestTasks,
        getStatusBadge,
        getPriorityBadge,
        handleProjectChange
    };
};