import CreateTeamModal from "components/modals/createTeamModal/CreateTeamModal";
import { useTeamHook } from "./useTeam";
import { NavLink, Outlet, useParams } from "react-router-dom";
export default function Team() {
    const { team, isCreateTeamOpen, setIsCreateTeamOpen, allTeams } = useTeamHook();

    return (
        <div className="flex w-full h-screen bg-white dark:bg-surface-dark">
            <main className="flex-1 p-8 overflow-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {team?.name || 'Loading...'}
                            </h1>
                        </div>

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

                <div className="animate-in fade-in duration-500">
                    <Outlet context={{ teamId: team?.id }} />
                </div>
            </main >
            <CreateTeamModal
                isOpen={isCreateTeamOpen}
                onClose={() => {
                    setIsCreateTeamOpen(false);
                }}
            />
        </div >
    );
}
