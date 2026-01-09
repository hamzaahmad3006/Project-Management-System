import React from 'react';
import { FaArrowUp, FaArrowDown, FaCalendar, FaChevronDown } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend, Chart } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { DashboardTask, Project, CalendarEvent, Subtask } from 'types';
import { useHomeHook } from './useHome';
import { Loader } from '../../../components/loader/Loader';
import { MdSettingsInputComponent } from 'react-icons/md';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);


const verticalLinePlugin = {
    id: 'verticalLine',
    afterDraw: (chart: Chart) => {
        const activeElements = chart.getActiveElements();
        if (activeElements.length) {
            const activePoint = activeElements[0];
            const { ctx } = chart;
            const element = activePoint.element as PointElement;
            const x = element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#94a3b8';
            ctx.stroke();
            ctx.restore();
        }
    }
};

ChartJS.register(verticalLinePlugin);

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
    } = useHomeHook();

    if (loading && !kpis) {
        return (
            <Loader />
        );
    }

    return (
        <div className="p-4 md:p-6 bg-[#FBFBFC] dark:bg-[#12141c] min-h-screen">
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#50555D] dark:text-gray-100 ">Dashboard</h1>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 dark:bg-[#1a1c23] p-3 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative min-w-[180px]">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => handleProjectChange(e.target.value)}
                                className="w-full pl-3 pr-10 py-1.5 bg-[#FEFEFE] dark:border-gray-700 dark:bg-gray-800/50 text-[#A6AEB4]   text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none font-medium"
                            >
                                <option value="all">All Projects</option>
                                {projects.map((project: Project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <FaChevronDown size={10} />
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-1.5 text-[#A6AEB4]  font-normal text-sm     shadow-blue-500/10">
                            <MdSettingsInputComponent size={13} className='text-blue-500' />
                            <span>Filters</span>
                        </button>
                    </div>


                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-gray-700 text-xs border border-gray-100 dark:border-gray-700/50">
                            <FaCalendar size={12} className="text-black" />
                            <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex gap-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-100 dark:border-gray-700/50">
                            {['D', 'W', 'M', 'BM', 'Y'].map((period) => (
                                <button key={period} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${period === 'M' ? 'bg-white dark:bg-gray-700 text-balck dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#FEFEFE] dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[16px] text-[#6B6E71] dark:text-gray-400">Total Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[21px] font-medium text-[#575A61] dark:text-gray-100">{kpis?.tasks?.total || 0}</span>
                        <div className="flex items-center gap-1 bg-green-100 text-green-600 text-sm">
                            <FaArrowUp size={12} className='rotate-45' />
                            <span>+3 points since yesterday</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FEFEFE] dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[16px] text-[#6B6E71] dark:text-gray-400">To Do Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[21px] font-medium text-[#575A61] dark:text-gray-100">
                            {(kpis?.tasks?.total || 0) - (kpis?.tasks?.completed || 0) - (kpis?.tasks?.inProgress || 0) - (kpis?.tasks?.canceled || 0)}
                        </span>
                        <div className="flex items-center gap-1 bg-red-100 text-red-600 text-sm">
                            <FaArrowDown size={12} className='-rotate-45' />
                            <span>-5 points since yesterday</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FEFEFE] dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[16px] text-[#6B6E71] dark:text-gray-400">In Progress Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[21px] font-medium text-[#575A61] dark:text-gray-100">{kpis?.tasks?.inProgress || 0}</span>
                        <div className="flex items-center gap-1 bg-green-100 text-green-600 text-sm">
                            <FaArrowUp size={12} className='rotate-45' />
                            <span>+3 points since yesterday</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FEFEFE] dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[16px] text-[#6B6E71] dark:text-gray-400">Cancelled Tasks</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[21px] font-medium text-[#575A61] dark:text-gray-100">{kpis?.tasks?.canceled || 0}</span>
                        <div className="flex items-center gap-1 bg-red-100 text-red-600 text-sm">
                            <FaArrowDown size={12} className='-rotate-45' />
                            <span>-3 points since yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h3 className="text-[16px] font-normal mb-4 text-[#77797C] dark:text-gray-100">Completion</h3>
                    <div className="relative w-48 h-48 mx-auto">
                        <Doughnut data={completionData} options={{
                            cutout: '90%',
                            plugins: { legend: { display: false } }
                        }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl italic font-bold text-[#2E343D] dark:text-gray-100">{completionPercentage}%</span>
                            <span className="text-[12px]  text-[#818486] dark:text-gray-400">Completed</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#838688] text-[12px] font-normal dark:text-gray-400">Projects:</span>
                            <span className="font-normal text-[#838688] text-[12px] dark:text-gray-100">{kpis?.projects?.active || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#838688] text-[12px] font-normal dark:text-gray-400">Completed Tasks:</span>
                            <span className="font-normal text-[#838688] text-[12px] dark:text-gray-100">{kpis?.tasks?.completed || 0}/{kpis?.tasks?.total || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#73767A] dark:text-gray-100">Schedule</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className={`text-gray-500 dark:text-gray-400 font-medium`}>
                                {weekDates[i].toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                        ))}
                        {weekDates.map((date, i) => {
                            const isSelected = date.getDate() === selectedDate.getDate() &&
                                date.getMonth() === selectedDate.getMonth() &&
                                date.getFullYear() === selectedDate.getFullYear();
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`py-1 w-full flex items-center justify-center rounded-full transition-all ${isSelected
                                        ? 'bg-[#0f4c75] text-white shadow-sm'
                                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-xs">
                            <button
                                onClick={() => setScheduleTab('Events')}
                                className={`px-3 py-1 rounded transition-colors ${scheduleTab === 'Events' ? 'bg-[#0f4c75] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                Events
                            </button>
                            <button
                                onClick={() => setScheduleTab('Meetings')}
                                className={`px-3 py-1 rounded transition-colors ${scheduleTab === 'Meetings' ? 'bg-[#0f4c75] text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}
                            >
                                Meetings
                            </button>
                            <button
                                onClick={() => setScheduleTab('Holidays')}
                                className={`px-3 py-1 rounded transition-colors ${scheduleTab === 'Holidays' ? 'bg-[#0f4c75] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                Holidays
                            </button>
                        </div>
                        <div className="space-y-2 mt-4">
                            {calendarLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : scheduleTab === 'Holidays' ? (
                                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm italic">
                                    No holiday yet
                                </div>
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((event: CalendarEvent) => (
                                    <div key={event.id} className={`flex items-center justify-between p-2 rounded ${event.type === 'MEETING' ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-purple-50 dark:bg-purple-900/10'}`}>
                                        <span className={`text-sm ${event.type === 'MEETING' ? 'text-blue-700 dark:text-blue-400' : 'text-purple-700 dark:text-purple-400'}`}>
                                            {event.title}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                    No {scheduleTab.toLowerCase()} scheduled
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-6 lg:col-span-1 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[15px] font-medium text-[#727477] dark:text-gray-100">Budget and Expenses</h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-600 px-2.5 py-1 rounded-md">
                            <FaArrowUp size={10} className="rotate-45" />
                            {kpis?.projects?.totalSpent && kpis.projects.totalBudget ? Math.round((kpis.projects.totalSpent / kpis.projects.totalBudget) * 100) : 0}%
                        </div>
                    </div>
                    <div className="h-64 relative">
                        <Line data={budgetData} options={budgetOptions} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h3 className="text-[16px] font-medium mb-4 text-[#717377] dark:text-gray-100">Latest Tasks</h3>
                {latestTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-600 dark:text-gray-400">
                                    <th className="pb-3 font-medium">
                                        <input type="checkbox" className="rounded bg-white dark:bg-gray-800 border-[#9FA9AF]  dark:border-gray-700" />
                                    </th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Task Name</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Project Name</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Subtasks</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Status</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Priority</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">Start Date</th>
                                    <th className="pb-3 font-medium text-[#9FA9AF]">End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestTasks.map((task: DashboardTask) => (
                                    <tr key={task.id} className="border-b border-gray-100 dark:border-gray-800 text-sm text-gray-900 dark:text-gray-300">
                                        <td className="py-3">
                                            <input type="checkbox" className="rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
                                        </td>
                                        <td className="py-3 text-[#7E8184] font-medium">{task.name}</td>
                                        <td className="py-3 text-[#7E8184] dark:text-gray-400">{task.project?.name || 'N/A'}</td>
                                        <td className="py-3 text-[#7E8184] dark:text-gray-400">
                                            {task.subtasks && task.subtasks.length > 0 ? (
                                                <span className="flex items-center gap-1">
                                                    {task.subtasks.filter((s: Subtask) => s.completed).length}/{task.subtasks.length}
                                                </span>
                                            ) : '-'}
                                        </td>
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
                                        <td className="py-3 text-[#7E8184] dark:text-gray-400">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="py-3 text-[#7E8184] dark:text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
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
