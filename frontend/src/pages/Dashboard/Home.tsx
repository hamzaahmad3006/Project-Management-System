import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchKPIs, fetchRecentActivity } from '../../store/slices/dashboardSlice';
import { FaArrowUp, FaArrowDown, FaFilter, FaCalendar } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { DashboardTask } from 'types';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Get data from Redux store
    const { kpis, recentActivity, loading: dashboardLoading } = useSelector((state: RootState) => state.dashboard);
    const theme = useSelector((state: RootState) => state.theme.theme);
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        // Fetch data on component mount
        dispatch(fetchKPIs());
        dispatch(fetchRecentActivity());
    }, [dispatch]);

    const loading = dashboardLoading;

    if (loading && !kpis) {
        return (
            <div className="p-6 flex items-center justify-center h-screen bg-white dark:bg-[#12141c]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Completion Chart Data
    const completionPercentage = kpis?.tasks?.total
        ? Math.round((kpis.tasks.completed / kpis.tasks.total) * 100)
        : 0;

    const completionData = {
        datasets: [{
            data: [kpis?.tasks?.completed || 0, (kpis?.tasks?.total || 0) - (kpis?.tasks?.completed || 0)],
            backgroundColor: [isDark ? '#3b82f6' : '#1E3A8A', isDark ? '#1f2937' : '#E5E7EB'],
            borderWidth: 0,
        }]
    };

    // Budget Chart Data
    const budgetData = {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [
            {
                label: 'Actual',
                data: [567, 580, 590, 600, 610, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1030, 1035, 1040, 1053],
                borderColor: isDark ? '#3b82f6' : '#1E3A8A',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 58, 138, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: [587, 600, 610, 620, 630, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1050, 1055, 1060, 1053],
                borderColor: isDark ? '#60A5FA' : '#60A5FA',
                backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

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

    // Get latest 4 tasks from recent activity
    const latestTasks = recentActivity.slice(0, 4);

    return (
        <div className="p-4 md:p-6 bg-[#FAFAFA] dark:bg-[#12141c] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm flex-grow md:flex-grow-0">
                        <option>All Projects</option>
                    </select>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex-grow md:flex-grow-0 justify-center">
                        <FaFilter size={14} />
                        Filters
                    </button>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                        <FaCalendar size={14} />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex gap-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-1 overflow-x-auto max-w-full">
                        {['D', 'W', 'M', 'BM', 'Y'].map((period) => (
                            <button key={period} className={`px-3 py-1 text-sm rounded ${period === 'M' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Tasks */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{kpis?.tasks?.total || 0}</span>
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                            <FaArrowUp size={12} />
                            <span>+3 points since yesterday</span>
                        </div>
                    </div>
                </div>

                {/* To Do Tasks */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">To Do Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                            {(kpis?.tasks?.total || 0) - (kpis?.tasks?.completed || 0) - (kpis?.tasks?.inProgress || 0) - (kpis?.tasks?.canceled || 0)}
                        </span>
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                            <FaArrowDown size={12} />
                            <span>-5 points since yesterday</span>
                        </div>
                    </div>
                </div>

                {/* In Progress Tasks */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">In Progress Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{kpis?.tasks?.inProgress || 0}</span>
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                            <FaArrowUp size={12} />
                            <span>+3 points since yesterday</span>
                        </div>
                    </div>
                </div>

                {/* Cancelled Tasks */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{kpis?.tasks?.canceled || 0}</span>
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                            <FaArrowDown size={12} />
                            <span>-3 points since yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Completion Chart */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Completion</h3>
                    <div className="relative w-48 h-48 mx-auto">
                        <Doughnut data={completionData} options={{
                            cutout: '75%',
                            plugins: { legend: { display: false } }
                        }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completionPercentage}%</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Projects:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{kpis?.projects?.active || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Completed Tasks:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{kpis?.tasks?.completed || 0}/{kpis?.tasks?.total || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Schedule</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="text-gray-500 dark:text-gray-400 font-medium">{day}</div>
                        ))}
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className={`py-2 ${i === new Date().getDay() - 1 ? 'bg-blue-600 text-white rounded-full' : 'text-gray-900 dark:text-gray-100'}`}>
                                {new Date().getDate() - new Date().getDay() + i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-xs">
                            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">Events</button>
                            <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">Meetings</button>
                            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">Holidays</button>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/10 rounded">
                                <span className="text-sm text-purple-700 dark:text-purple-400">Daily Standup</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">9:30-10:00AM</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
                                <span className="text-sm text-blue-700 dark:text-blue-400">Sync with Marketing</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">10:30-11:00AM</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/10 rounded">
                                <span className="text-sm text-orange-700 dark:text-orange-400">Internal Review</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">11:00-11:15AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget Chart */}
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget and Expenses</h3>
                        <span className="text-green-600 text-sm font-medium">+85.2%</span>
                    </div>
                    <Line data={budgetData} options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { display: false },
                            x: { display: false }
                        }
                    }} />
                    <div className="flex gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">Expenses</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Tasks Table */}
            <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Latest Tasks</h3>
                {latestTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-600 dark:text-gray-400">
                                    <th className="pb-3 font-medium">
                                        <input type="checkbox" className="rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
                                    </th>
                                    <th className="pb-3 font-medium">Task Name</th>
                                    <th className="pb-3 font-medium">Project Name</th>
                                    <th className="pb-3 font-medium">Subtasks</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Priority</th>
                                    <th className="pb-3 font-medium">Start Date</th>
                                    <th className="pb-3 font-medium">End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestTasks.map((task: DashboardTask) => (
                                    <tr key={task.id} className="border-b border-gray-100 dark:border-gray-800 text-sm text-gray-900 dark:text-gray-300">
                                        <td className="py-3">
                                            <input type="checkbox" className="rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
                                        </td>
                                        <td className="py-3 font-medium">{task.name}</td>
                                        <td className="py-3 text-gray-600 dark:text-gray-400">{task.project?.name || 'N/A'}</td>
                                        <td className="py-3">
                                            <span className="text-gray-600 dark:text-gray-400">-</span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(task.status)}`}>
                                                {task.status === 'TODO' ? 'To Do' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`flex items-center gap-1 ${getPriorityBadge(task.priority)}`}>
                                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600 dark:text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="py-3 text-gray-600 dark:text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No tasks available. Create your first task to get started!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
