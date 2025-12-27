import React from 'react';
import { FaArrowUp, FaArrowDown, FaFilter, FaCalendar } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { DashboardTask } from '../../../types';
import { useHomeHook } from './useHome';
import { Loader } from '../../../components/loader/Loader';
import SelectField from 'components/ui/inputFields/SelectedForm';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const {
        kpis,
        projects,
        selectedProjectId,
        loading,
        completionPercentage,
        completionData,
        budgetData,
        budgetOptions,
        latestTasks,
        getStatusBadge,
        getPriorityBadge,
        handleProjectChange
    } = useHomeHook();

    if (loading && !kpis) {
        return (
            <Loader />
        );
    }

    return (
        <div className="p-4 md:p-6 bg-[#FAFAFA] dark:bg-[#12141c] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <select
                        value={selectedProjectId}
                        onChange={(e) => handleProjectChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[150px]"
                    >
                        <option value="all">All Projects</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                            <div key={i} className={`py-2 ${i === (new Date().getDay() || 7) - 1 ? 'bg-blue-600 text-white rounded-full' : 'text-gray-900 dark:text-gray-100'}`}>
                                {new Date().getDate() - (new Date().getDay() || 7) + i + 1}
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

                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget vs. Spend</h3>
                        <div className="flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded">
                            {kpis?.projects?.totalSpent && kpis.projects.totalBudget ? Math.round((kpis.projects.totalSpent / kpis.projects.totalBudget) * 100) : 0}% Consumed
                        </div>
                    </div>
                    <div className="h-48">
                        <Bar data={budgetData} options={budgetOptions} />
                    </div>
                </div>
            </div>

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
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Priority</th>
                                    <th className="pb-3 font-medium">Budget</th>
                                    <th className="pb-3 font-medium">Due Date</th>
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
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`flex items-center gap-1 ${getPriorityBadge(task.priority)}`}>
                                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 text-blue-600 dark:text-blue-400 font-medium">${task.budget?.toLocaleString() || '0'}</td>
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
