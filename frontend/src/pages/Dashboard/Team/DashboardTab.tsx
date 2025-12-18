// DashboardPage.tsx
import React from "react";

export default function DashboardPage() {
    // small demo data to draw the cards + chart bars + list
    const stats = [
        { title: "Completed tasks", value: 127, meta: "67.18%" },
        { title: "Incompleted tasks", value: 62, meta: "54.29%" },
        { title: "Overdue tasks", value: 20, meta: "14.11%" },
        { title: "Total income", value: "$15,302", meta: "21.18%" },
    ];

    const bars = [
        { label: "Jan", value: 30 },
        { label: "Feb", value: 70 },
        { label: "Mar", value: 55 },
        { label: "Apr", value: 60 },
        { label: "May", value: 65 },
        { label: "Jun", value: 100, highlight: true },
        { label: "Jul", value: 45 },
        { label: "Aug", value: 80 },
        { label: "Sep", value: 20 },
        { label: "Oct", value: 50 },
        { label: "Nov", value: 40 },
        { label: "Dec", value: 60 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* top stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{s.title}</div>
                        <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{s.value}</div>
                        <div className="text-sm font-medium text-blue-500 dark:text-blue-400 mt-2 flex items-center gap-1">
                            <span className="text-[10px]">↑</span> {s.meta}
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
                            <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">$127,289</div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Billable</button>
                            <button className="px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Non-billable</button>
                        </div>
                    </div>

                    {/* simple bar chart using divs */}
                    <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 border-b border-gray-100 dark:border-gray-800 pb-1">
                        {bars.map((b, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 group-hover:opacity-80 ${b.highlight ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-100 dark:bg-gray-800"}`}
                                    style={{ height: `${(b.value / 100) * 160}px` }}
                                />
                                <div className="text-[10px] font-medium text-gray-500 dark:text-gray-500 mt-1">{b.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline section */}
                    <div className="mt-8">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-6">Timeline</div>
                        <div className="space-y-4">
                            {/* timeline row - color blocks mimic events */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 text-xs font-medium text-gray-400 dark:text-gray-500">10:00</div>
                                <div className="flex-1 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 px-4 flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-400">
                                    Contact customers with failed new payments
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 text-xs font-medium text-gray-400 dark:text-gray-500">11:00</div>
                                <div className="flex-1 h-10 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 px-4 flex items-center text-sm font-medium text-green-800 dark:text-green-400">
                                    Dashboard: concept
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 text-xs font-medium text-gray-400 dark:text-gray-500">12:00</div>
                                <div className="flex-1 h-10 rounded-lg bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20 px-4 flex items-center text-sm font-medium text-pink-800 dark:text-pink-400">
                                    Task detail modal
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right column: top completed tasks + earnings */}
                <aside className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top completed tasks</div>
                            <button className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">This week</button>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-cover border-2 border-white dark:border-gray-800 shadow-sm" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/65.jpg')" }} />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Hanna Rodgers</div>
                                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">QA Lead</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">24</div>
                            </li>

                            <li className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-cover border-2 border-white dark:border-gray-800 shadow-sm" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }} />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Henry Rollins</div>
                                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Support</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">20</div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Top earning</div>
                            <button className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">This month</button>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-lg">💼</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Development</div>
                                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">72 completed tasks</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">$3,340.21</div>
                            </li>

                            <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-lg">📁</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Directions</div>
                                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">57 completed tasks</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">$2,800.30</div>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
