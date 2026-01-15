import CreateTeamModal from 'components/modals/createTeamModal/CreateTeamModal';
import { useTeamHook } from './useTeam';
import { NavLink, Outlet, useParams } from 'react-router-dom';
export default function Team() {
  const { team, isCreateTeamOpen, setIsCreateTeamOpen, allTeams } = useTeamHook();

  return (
    <div className="flex w-full h-screen bg-white dark:bg-surface-dark">
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto custom-scrollbar">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                {team?.name || 'Loading...'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Share
            </button>
            <button
              className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsCreateTeamOpen(true);
              }}
            >
              Create
            </button>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
          <nav className="flex gap-4 sm:gap-6 text-sm min-w-max">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                isActive
                  ? 'pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all'
                  : 'pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all'
                  : 'pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="members"
              className={({ isActive }) =>
                isActive
                  ? 'pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all'
                  : 'pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
              }
            >
              Members
            </NavLink>

            <NavLink
              to="files"
              className={({ isActive }) =>
                isActive
                  ? 'pb-3 border-b-2 border-blue-600 dark:border-blue-500 font-medium text-blue-600 dark:text-blue-500 transition-all'
                  : 'pb-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
              }
            >
              Files
            </NavLink>
          </nav>
        </div>

        <div className="animate-in fade-in duration-500">
          <Outlet context={{ teamId: team?.id }} />
        </div>
      </main>
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => {
          setIsCreateTeamOpen(false);
        }}
      />
    </div>
  );
}
