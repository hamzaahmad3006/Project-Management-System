import { Loader } from 'components/loader/Loader';
import { Bar } from 'react-chartjs-2';
import { useDashboardTabHook } from './useTeam';
import { TeamStat, CalendarEvent, TeamMemberStat, TeamProjectStat } from 'types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const {
    loading,
    displayStats,
    chartData,
    chartOptions,
    hours,
    todayEvents,
    currentDateDisplay,
    filteredTeamProjects,
    setSelectedProjectId,
    selectedProjectId,
    selectedYear,
    setSelectedYear,
    dispatch,
  } = useDashboardTabHook();

  if (loading || !displayStats) {
    return <Loader fullscreen={false} />;
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
          {filteredTeamProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.stats.map((s: TeamStat, i: number) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm"
          >
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">{s.title}</div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
              <div
                className={`text-[10px] font-bold ${i === 1 ? 'text-red-500' : 'text-blue-500'}`}
              >
                {s.meta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Overview</div>
                <div className="text-4xl font-bold mt-2 text-gray-900 dark:text-gray-100 tracking-tight">
                  {displayStats.overview.totalSpent}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1 rounded-lg">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-semibold transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Billable
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-md text-xs font-semibold transition-all">
                    Non-billable
                  </button>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 outline-none hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>
            <div className="h-[240px] w-full mt-4">
              {chartData && <Bar data={chartData} options={chartOptions} />}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 pb-2 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Timeline</h3>
                {todayEvents.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-200 dark:border-blue-800/50">
                    {todayEvents.length} {todayEvents.length === 1 ? 'Meeting' : 'Meetings'}
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500">
                {currentDateDisplay}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <div className="min-w-[800px]">
                <div className="flex bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50">
                  {hours.map((h) => (
                    <div
                      key={h}
                      className="flex-1 py-3 text-center border-r border-gray-100/50 dark:border-gray-800/20 last:border-0"
                    >
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-tighter">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative h-[220px] p-6 pt-8">
                  {todayEvents.length > 0 ? (
                    todayEvents.slice(0, 4).map((event: CalendarEvent, idx: number) => {
                      const start = new Date(event.startTime);
                      const end = new Date(event.endTime);

                      const startHour = start.getHours() + start.getMinutes() / 60;
                      const endHour = end.getHours() + end.getMinutes() / 60;

                      const leftPercent = Math.max(0, Math.min(100, ((startHour - 8) / 9) * 100));
                      const endPercent = Math.max(0, Math.min(100, ((endHour - 8) / 9) * 100));
                      const widthPercent = Math.max(5, endPercent - leftPercent);

                      const typeColors: Record<string, string> = {
                        MEETING:
                          'bg-orange-50/70 border-orange-400 text-orange-900 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
                        DEADLINE:
                          'bg-rose-50/70 border-rose-400 text-rose-900 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700',
                        EVENT:
                          'bg-blue-50/70 border-blue-400 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700',
                      };
                      const color = typeColors[event.type] || typeColors['EVENT'];

                      return (
                        <div
                          key={event.id}
                          className={`absolute h-14 flex items-center px-4 rounded-xl border border-l-4 text-[10px] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${color}`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            top: `${idx * 64 + 20}px`,
                          }}
                        >
                          <div className="truncate w-full">
                            <div className="font-bold text-xs mb-0.5">{event.title}</div>
                            <div className="flex items-center gap-1.5 opacity-70 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                              {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                              - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-1">
                        📅
                      </div>
                      <p className="text-xs font-medium italic">No meetings or events for today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Top completed tasks
              </div>
              <select className="bg-transparent text-[10px] font-bold text-gray-400 outline-none cursor-pointer">
                <option>This week</option>
              </select>
            </div>
            <ul className="space-y-5">
              {(displayStats.topMembers.length > 0 ? displayStats.topMembers : []).map(
                (member: TeamMemberStat) => (
                  <li key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img
                          src={
                            member.avatar ||
                            `https://ui-avatars.com/api/?name=${member.name}&background=random`
                          }
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {member.completedTasks}
                    </div>
                  </li>
                )
              )}
              {displayStats.topMembers.length === 0 && (
                <div className="text-center text-[10px] text-gray-400 py-4">No data</div>
              )}
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top earning</div>
              <select className="bg-transparent text-[10px] font-bold text-gray-400 outline-none cursor-pointer">
                <option>This month</option>
              </select>
            </div>
            <ul className="space-y-5">
              {(displayStats.topProjects.length > 0 ? displayStats.topProjects : []).map(
                (project: TeamProjectStat, i: number) => (
                  <li key={project.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${i % 2 === 0 ? 'bg-cyan-50 text-cyan-500' : 'bg-orange-50 text-orange-500'}`}
                      >
                        {i % 2 === 0 ? '📊' : '📅'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {project.name}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {project.completedTasks} completed tasks
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      ${project.spent.toLocaleString()}
                    </div>
                  </li>
                )
              )}
              {displayStats.topProjects.length === 0 && (
                <div className="text-center text-[10px] text-gray-400 py-4">No data</div>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
