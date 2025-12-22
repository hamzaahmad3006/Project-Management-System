import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTeamStats } from "../../../store/slices/teamSlice";
import { fetchKPIs, fetchRecentActivity } from "../../../store/slices/dashboardSlice";
import { AppDispatch, RootState } from "../../../store/store";
import Loader from "components/Loaders/Loader";

export default function DashboardPage() {
    const { teamId: teamIdFromUrl } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { allTeams, stats: teamStats, loading: teamLoading } = useSelector((state: RootState) => state.team);
    const { selectedProjectId, projects } = useSelector((state: RootState) => state.projects);
    const { kpis, recentActivity, loading: dashLoading } = useSelector((state: RootState) => state.dashboard);

    // Determine target team ID
    const teamId = (() => {
        if (teamIdFromUrl) return teamIdFromUrl;
        if (selectedProjectId !== 'all') {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project?.teamId) return project.teamId;
            return null;
        }
        return null; // Show all team stats if 'all' is selected
    })();

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamStats(teamId));
        } else {
            dispatch(fetchKPIs('all'));
            dispatch(fetchRecentActivity('all'));
        }
    }, [dispatch, teamId]);

    const loading = teamLoading || dashLoading;

    // Map global KPIs to the same structure as team stats for the UI
    const displayStats = teamId ? teamStats : (kpis ? {
        stats: [
            { title: "Completed tasks", value: kpis.tasks.completed, meta: `${kpis.tasks.total > 0 ? ((kpis.tasks.completed / kpis.tasks.total) * 100).toFixed(2) : 0}%` },
            { title: "Incompleted tasks", value: kpis.tasks.total - kpis.tasks.completed, meta: `${kpis.tasks.total > 0 ? (((kpis.tasks.total - kpis.tasks.completed) / kpis.tasks.total) * 100).toFixed(2) : 0}%` },
            { title: "Active Projects", value: kpis.projects.active, meta: "Live projects" },
            { title: "Total Budget", value: `$${kpis.projects.totalBudget.toLocaleString()}`, meta: `$${kpis.projects.totalSpent.toLocaleString()} spent` },
        ],
        overview: {
            totalSpent: `$${kpis.projects.totalSpent.toLocaleString()}`,
            chartData: [] // We don't have per-month data in global KPIs yet, or we can use another field
        },
        topMembers: [],
        topProjects: [],
        recentActivities: recentActivity.map(a => ({
            id: a.id,
            name: a.name,
            updatedAt: a.updatedAt,
            status: a.status
        }))
    } : null);

    if (loading || !displayStats) {
        return <Loader />;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* top stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayStats.stats.map((s: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{s.title}</div>
                        <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{s.value}</div>
                        <div className="text-sm font-medium text-blue-500 dark:text-blue-400 mt-2 flex items-center gap-1">
                            {s.meta}
                        </div>
                    </div>
                ))}
            </div>

            {/* main chart + right column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Overview</div>
                            <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">{displayStats.overview.totalSpent}</div>
                        </div>
                    </div>

                    {/* Timeline section */}
                    <div className="mt-8">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activities</div>
                        <div className="space-y-4">
                            {displayStats.recentActivities && displayStats.recentActivities.length > 0 ? displayStats.recentActivities.map((activity: any) => (
                                <div key={activity.id} className="flex items-center gap-4">
                                    <div className="w-10 text-xs font-medium text-gray-400 dark:text-gray-500">
                                        {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className={`flex-1 h-10 rounded-lg px-4 flex items-center justify-between text-sm font-medium border ${activity.status === 'COMPLETED'
                                        ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 text-green-800 dark:text-green-400'
                                        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-800 dark:text-blue-400'
                                        }`}>
                                        <span>{activity.name}</span>
                                        <span className="text-[10px] opacity-70 uppercase tracking-wider">{activity.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-xs text-gray-400 text-center py-4">No recent activity</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* right column: top contributors (filtered or global) */}
                <aside className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-8">
                    {displayStats.topMembers && displayStats.topMembers.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top contributors</div>
                            </div>
                            <ul className="space-y-4">
                                {displayStats.topMembers.map((member: any) => (
                                    <li key={member.id} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-cover border-2 border-white dark:border-gray-800 shadow-sm" style={{ backgroundImage: `url(${member.avatar || 'https://www.gravatar.com/avatar?d=mp'})` }} />
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{member.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{member.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{member.completedTasks}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {displayStats.topProjects && displayStats.topProjects.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Project Performance</div>
                            </div>
                            <ul className="space-y-4">
                                {displayStats.topProjects.map((project: any) => (
                                    <li key={project.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-lg">📁</div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{project.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Utilization</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">${project.spent.toLocaleString()}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
