import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import { fetchTeamStats } from "../../../store/slices/teamSlice";
import { fetchKPIs, fetchRecentActivity } from "../../../store/slices/dashboardSlice";
import { fetchProjects, setSelectedProjectId } from "../../../store/slices/projectSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { Loader } from "components/loader/Loader";
import { Bar } from 'react-chartjs-2';
import { useDashboardTabHook } from "./useTeam";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardPage() {
    const { loading, displayStats, chartData, chartOptions, hours, filteredTeamProjects, setSelectedProjectId, selectedProjectId, dispatch
    } = useDashboardTabHook()

    if (loading || !displayStats) {
        return <Loader />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Teamspace overview</div>
                <select
                    value={selectedProjectId}
                    onChange={(e) => dispatch(setSelectedProjectId(e.target.value))}
                    className="px-4 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none shadow-sm cursor-pointer"
                >
                    <option value="all">All projects</option>
                    {filteredTeamProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayStats.stats.map((s: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">{s.title}</div>
                        <div className="flex items-baseline justify-between mt-2">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
                            <div className={`text-[10px] font-bold ${i === 1 ? 'text-red-500' : 'text-blue-500'}`}>
                                {s.meta}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Overview</div>
                                <div className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">{displayStats.overview.totalSpent}</div>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold">Billable</span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full text-[10px] font-bold">Non-billable</span>
                                <select className="ml-4 bg-transparent border border-gray-100 dark:border-gray-800 rounded px-2 py-1 text-xs text-gray-500 outline-none">
                                    <option>2025</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-[200px]">
                            {chartData && <Bar data={chartData} options={chartOptions} />}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Timeline</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">December 23, 2025</div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar pb-2">
                            <div className="min-w-[800px]">
                                <div className="grid grid-cols-10 border-b border-gray-100 dark:border-gray-800 mb-6">
                                    {hours.map(h => (
                                        <div key={h} className="text-[10px] text-gray-400 dark:text-gray-500 pb-2 text-center">{h}</div>
                                    ))}
                                </div>

                                <div className="relative h-[180px] space-y-3">
                                    {displayStats.recentActivities.slice(0, 5).map((activity: any, idx: number) => {
                                        const colors = [
                                            'bg-orange-50 border-orange-100 text-orange-700',
                                            'bg-green-50 border-green-100 text-green-700',
                                            'bg-blue-50 border-blue-100 text-blue-700',
                                            'bg-purple-50 border-purple-100 text-purple-700',
                                        ];
                                        const color = colors[idx % colors.length];
                                        const left = `${(idx * 15) % 80}%`;
                                        const width = `${20 + (idx * 10) % 30}%`;

                                        return (
                                            <div
                                                key={activity.id}
                                                className={`absolute left-0 right-0 h-8 flex items-center px-4 rounded-lg border text-[10px] font-medium transition-all ${color}`}
                                                style={{ left, width, top: `${idx * 40}px` }}
                                            >
                                                <div className="truncate">
                                                    <div>{activity.name}</div>
                                                    <div className="opacity-60">10:00-12:00</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {displayStats.recentActivities.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">No activities scheduled</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top completed tasks</div>
                            <select className="bg-transparent text-[10px] font-bold text-gray-400 outline-none cursor-pointer">
                                <option>This week</option>
                            </select>
                        </div>
                        <ul className="space-y-5">
                            {(displayStats.topMembers.length > 0 ? displayStats.topMembers : []).map((member: any) => (
                                <li key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                                            <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{member.name}</div>
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500">{member.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{member.completedTasks}</div>
                                </li>
                            ))}
                            {displayStats.topMembers.length === 0 && <div className="text-center text-[10px] text-gray-400 py-4">No data</div>}
                        </ul>
                    </div>

                    {/* Top Earning */}
                    <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top earning</div>
                            <select className="bg-transparent text-[10px] font-bold text-gray-400 outline-none cursor-pointer">
                                <option>This month</option>
                            </select>
                        </div>
                        <ul className="space-y-5">
                            {(displayStats.topProjects.length > 0 ? displayStats.topProjects : []).map((project: any, i: number) => (
                                <li key={project.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${i % 2 === 0 ? 'bg-cyan-50 text-cyan-500' : 'bg-orange-50 text-orange-500'}`}>
                                            {i % 2 === 0 ? '📊' : '📅'}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{project.name}</div>
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500">72 completed tasks</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">${project.spent.toLocaleString()}</div>
                                </li>
                            ))}
                            {displayStats.topProjects.length === 0 && <div className="text-center text-[10px] text-gray-400 py-4">No data</div>}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
