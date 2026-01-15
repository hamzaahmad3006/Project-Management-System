import { Loader } from 'components/loader/Loader';
import { useMemberTabHook } from './useTeam';
import { MemberListItem, TeamMember, User } from 'types';

export default function MembersTab() {
  const { loading, allTeams, teamId, displayMembers } = useMemberTabHook();
  if (loading) return <Loader fullscreen={false} />;

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1a1c23] overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Position</th>
              <th className="text-left p-4 font-semibold">Role</th>
              <th className="text-left p-4 font-semibold">Location</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayMembers && displayMembers.length > 0 ? (
              displayMembers.map((item: MemberListItem, index: number) => {
                const user =
                  (item as { user: User | TeamMember }).user || (item as User | TeamMember);
                return (
                  <tr
                    key={user.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full mr-3 border border-gray-100 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {user.name ? user.name.charAt(0) : '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-700">
                        {user.role || 'Member'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {user.role || 'Member'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-gray-600 dark:text-gray-400">Faisalabad, Pakistan</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">👤</span>
                    <span>No members found for this team</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
