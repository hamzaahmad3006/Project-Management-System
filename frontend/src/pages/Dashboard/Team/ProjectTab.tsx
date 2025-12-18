import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { fetchProjects } from "../../../store/slices/projectSlice";
import Loader from "components/Loaders/Loader";

export default function ProjectTab() {
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector(state => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50';
            case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
            case 'on hold': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50';
            case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50';
            case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
        }
    };

    const calculateProgress = (tasks?: { status: string }[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        return Math.round((completed / tasks.length) * 100);
    };

    if (loading) return <Loader />;

    return (
        <div className="flex w-full h-screen bg-white dark:bg-[#12141c]">


            {/* RIGHT MAIN CONTENT */}
            <main className="flex-1 p-0 animate-in fade-in slide-in-from-bottom-2 duration-500">


                {/* PROJECT TABLE */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1a1c23]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="text-left p-4 font-semibold">Name</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-left p-4 font-semibold">Task progress</th>
                                <th className="text-left p-4 font-semibold">Due date</th>
                                <th className="text-left p-4 font-semibold">Priority</th>
                                <th className="text-left p-4 font-semibold">Members</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {projects.length > 0 ? (
                                projects.map((item, index) => {
                                    const progress = calculateProgress(item.tasks);
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">{item.name}</td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{progress}%</span>
                                                </div>
                                            </td>

                                            <td className="p-4 text-gray-600 dark:text-gray-400">
                                                {new Date(item.endDate).toLocaleDateString()}
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}
                                                >
                                                    {item.priority || 'MEDIUM'}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center -space-x-2">
                                                    {item.team?.members?.slice(0, 4).map((m, i) => (
                                                        m.user.avatar ? (
                                                            <img
                                                                key={i}
                                                                src={m.user.avatar}
                                                                alt={m.user.name}
                                                                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                key={i}
                                                                className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400"
                                                            >
                                                                {m.user.name.charAt(0)}
                                                            </div>
                                                        )
                                                    ))}
                                                    {(item.team?.members?.length || 0) > 4 && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                            +{(item.team?.members?.length || 0) - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-2xl">📁</span>
                                            <span>No projects found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
