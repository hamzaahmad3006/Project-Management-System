import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchKPIs, fetchRecentActivity } from '../../../store/slices/dashboardSlice';
import { fetchProjects, setSelectedProjectId } from '../../../store/slices/projectSlice';
import { fetchEvents } from '../../../store/slices/calendarSlice';
import { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { ChartPoint, CalendarEvent, DashboardTask } from 'types';

export const useHomeHook = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { kpis, recentActivity, loading: dashboardLoading } = useSelector((state: RootState) => state.dashboard);
    const { projects, selectedProjectId } = useSelector((state: RootState) => state.projects);
    const { events, loading: calendarLoading } = useSelector((state: RootState) => state.calendar);
    const theme = useSelector((state: RootState) => state.theme.theme);

    const [scheduleTab, setScheduleTab] = useState<'Events' | 'Meetings' | 'Holidays'>('Events');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const weekDates = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + 1);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }, []);

    const isDark = useMemo(() => {
        return theme === 'dark';
    }, [theme]);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        const projectId = selectedProjectId === 'all' ? undefined : selectedProjectId;
        dispatch(fetchKPIs({ projectId }));
        dispatch(fetchRecentActivity(projectId));
        dispatch(fetchEvents({ projectId }));
    }, [dispatch, selectedProjectId]);

    const completionPercentage = useMemo(() => {
        return kpis?.tasks?.total
            ? Math.round((kpis.tasks.completed / kpis.tasks.total) * 100)
            : 0;
    }, [kpis]);

    const completionData = useMemo(() => ({
        datasets: [{
            data: [kpis?.tasks?.completed || 0, (kpis?.tasks?.total || 0) - (kpis?.tasks?.completed || 0)],
            backgroundColor: [isDark ? '#3b82f6' : '#0f4c75', isDark ? '#1f2937' : '#E5E7EB'],
            borderWidth: 0,
        }]
    }), [kpis, isDark]);

    const budgetData: ChartData<'line'> = useMemo(() => {
        const chartPoints = kpis?.chartData || [];
        const labels = chartPoints.map((d: ChartPoint) => d.label);
        const rawSpendData = chartPoints.map((d: ChartPoint) => d.value);

        const displayLabels = labels.length > 0 ? labels : Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0'));
        const displaySpend = rawSpendData.length > 0 ? rawSpendData : new Array(30).fill(0);

        const initialSpend = kpis?.initialSpend || 0;
        const cumulativeSpend = displaySpend.reduce((acc: number[], val: number, i: number) => {
            acc.push((acc[i - 1] || initialSpend) + val);
            return acc;
        }, []);

        const totalBudget = kpis?.projects?.totalBudget || 0;
        const budgetDataLine = new Array(cumulativeSpend.length).fill(totalBudget);

        return {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Budget',
                    data: budgetDataLine,
                    borderColor: '#34d399',
                    backgroundColor: (context: ScriptableContext<'line'>) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return 'rgba(52, 211, 153, 0.05)';
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(52, 211, 153, 0.01)');
                        gradient.addColorStop(1, 'rgba(52, 211, 153, 0.1)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#34d399',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    borderWidth: 2,
                },
                {
                    label: 'Expenses',
                    data: cumulativeSpend,
                    borderColor: '#0f4c75',
                    backgroundColor: (context: ScriptableContext<'line'>) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return 'rgba(15, 76, 117, 0.2)';
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(15, 76, 117, 0.05)');
                        gradient.addColorStop(1, 'rgba(15, 76, 117, 0.4)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#0f4c75',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    borderWidth: 3,
                }
            ]
        };
    }, [kpis, isDark]);

    const budgetOptions: ChartOptions<'line'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    color: isDark ? '#9ca3af' : '#64748b',
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                titleColor: isDark ? '#4b5563' : '#64748b',
                bodyColor: isDark ? '#f1f5f9' : '#1e293b',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        let value = context.raw as number;
                        let formatted: string | number = value;
                        if (value >= 1000000) formatted = `${(value / 1000000).toFixed(1)}M`;
                        else if (value >= 1000) formatted = `${(value / 1000).toFixed(0)}k`;
                        return `${context.dataset.label}: ${formatted}`;
                    },
                    title: (items) => {
                        if (!items || items.length === 0) return '';
                        const index = items[0].dataIndex;
                        const dataPoint = kpis?.chartData?.[index];
                        const month = dataPoint?.month || new Date().toLocaleDateString('en-US', { month: 'short' });
                        const day = items[0].label;
                        const year = new Date().getFullYear();
                        return `${month} ${day}, ${year}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                },
                ticks: {
                    color: isDark ? '#4b5563' : '#94a3b8',
                    font: { size: 10 },
                    callback: (value) => {
                        const val = value as number;
                        if (val >= 1000000) return `${val / 1000000}M`;
                        if (val >= 1000) return `${val / 1000}k`;
                        return val;
                    }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: isDark ? '#4b5563' : '#94a3b8',
                    font: { size: 10 },
                    autoSkip: true,
                    maxTicksLimit: 15
                }
            }
        },
    }), [isDark, kpis]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'TODO': 'bg-[#0043C0] text-white font-bold text-sm',
            'IN_PROGRESS': 'bg-[#DD7902] text-white font-bold text-sm',
            'COMPLETED': 'bg-[#0A8401] text-white font-bold text-sm',
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

    const latestTasks = useMemo(() => recentActivity.slice(0, 4) as DashboardTask[], [recentActivity]);

    const filteredEvents = useMemo(() => {
        const dateFiltered = events.filter((e: CalendarEvent) => {
            const eventDate = new Date(e.startTime);
            return (
                eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear()
            );
        });

        if (scheduleTab === 'Meetings') {
            return dateFiltered.filter((e: CalendarEvent) => e.type === 'MEETING');
        }
        if (scheduleTab === 'Events') {
            return dateFiltered.filter((e: CalendarEvent) => e.type === 'EVENT' || e.type === 'DEADLINE');
        }
        return [];
    }, [events, scheduleTab, selectedDate]);

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
        filteredEvents,
        scheduleTab,
        setScheduleTab,
        selectedDate,
        setSelectedDate,
        weekDates,
        calendarLoading,
        getStatusBadge,
        getPriorityBadge,
        handleProjectChange
    };
};