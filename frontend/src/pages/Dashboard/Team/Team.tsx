import CreateTeamModal from "components/Modals/CreateTeamModal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { fetchProjects } from "store/slices/projectSlice";
import { getTeams } from "store/slices/teamSlice";
import { AppDispatch, RootState } from "store/store";

export default function Team() {
    const dispatch = useDispatch<AppDispatch>();
    const { teamId: teamIdFromUrl } = useParams();
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const { allTeams } = useSelector((state: RootState) => state.team);
    const { selectedProjectId, projects } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        dispatch(getTeams());
        dispatch(fetchProjects());
    }, [dispatch]);

    // Priority:
    // 1. teamId from URL (if any, though we reverted to /team)
    // 2. teamId from selectedProjectId
    // 3. Fallback to first team
    const team = (() => {
        if (teamIdFromUrl) return allTeams.find(t => t.id === teamIdFromUrl);
        if (selectedProjectId !== 'all') {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project?.teamId) {
                return allTeams.find(t => t.id === project.teamId);
            }
        }
        return allTeams[0];
    })();

    return (
        <div className="flex w-full h-screen bg-white dark:bg-[#12141c]">
            {/* Main area */}
            <main className="flex-1 p-8 overflow-auto custom-scrollbar">
                {/* Header (team name) */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Defcon / {team?.name || 'Loading...'}
                        </h1>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Teamspace overview</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Share</button>
                        <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsCreateTeamOpen(true);
                        }}>Create</button>
                    </div>
                </div>

                {/* Top tabs (projects / dashboard / members / files) */}
                <div className="mb-6 border-b border-gray-100 dark:border-gray-800">
                    <nav className="flex gap-6 text-sm">
                        <NavLink
                            to="."
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all"
                                    : "pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                            }
                        >
                            Projects
                        </NavLink>

                        <NavLink
                            to="dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all"
                                    : "pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="members"
                            className={({ isActive }) =>
                                isActive
                                    ? "pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all"
                                    : "pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                            }
                        >
                            Members
                        </NavLink>

                        <NavLink
                            to="files"
                            className={({ isActive }) =>
                                isActive
                                    ? "pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all"
                                    : "pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                            }
                        >
                            Files
                        </NavLink>
                    </nav>
                </div>

                {/* Outlet will render Projects / Dashboard / Members / Files */}
                <div className="animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
            <CreateTeamModal
                isOpen={isCreateTeamOpen}
                onClose={() => {
                    setIsCreateTeamOpen(false);
                }}
            />
        </div >
    );
}
