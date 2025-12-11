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
        <div className="space-y-6">
            {/* top stat cards */}
            <div className="grid grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border rounded p-4">
                        <div className="text-xs text-gray-400">{s.title}</div>
                        <div className="text-2xl font-semibold mt-2">{s.value}</div>
                        <div className="text-sm text-blue-500 mt-2">{s.meta}</div>
                    </div>
                ))}
            </div>

            {/* main chart + right column */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white border rounded p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs text-gray-400">Overview</div>
                            <div className="text-3xl font-semibold mt-2">$127,289</div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs border rounded-full">Billable</button>
                            <button className="px-3 py-1 text-xs border rounded-full">Non-billable</button>
                        </div>
                    </div>

                    {/* simple bar chart using divs */}
                    <div className="flex items-end gap-4 h-36">
                        {bars.map((b, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    className={`rounded-md ${b.highlight ? "bg-blue-600" : "bg-gray-200"}`}
                                    style={{ height: `${(b.value / 100) * 140}px`, width: 28 }}
                                />
                                <div className="text-xs text-gray-500 mt-2">{b.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline section */}
                    <div className="mt-8">
                        <div className="text-sm text-gray-500 mb-4">Timeline</div>
                        <div className="space-y-3">
                            {/* timeline row - color blocks mimic events */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 text-xs text-gray-400">10:00</div>
                                <div className="flex-1 h-8 rounded bg-yellow-100 px-3 flex items-center">Contact customers with failed new payments</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 text-xs text-gray-400">11:00</div>
                                <div className="flex-1 h-8 rounded bg-green-100 px-3 flex items-center">Dashboard: concept</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 text-xs text-gray-400">12:00</div>
                                <div className="flex-1 h-8 rounded bg-pink-100 px-3 flex items-center">Task detail modal</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right column: top completed tasks + earnings */}
                <aside className="bg-white border rounded p-4 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm font-medium">Top completed tasks</div>
                            <button className="text-xs text-gray-500 border px-2 py-1 rounded">This week</button>
                        </div>

                        <ul className="space-y-3">
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cover" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/65.jpg')" }} />
                                    <div>
                                        <div className="font-medium">Hanna Rodgers</div>
                                        <div className="text-xs text-gray-400">QA Lead</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">24</div>
                            </li>

                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cover" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }} />
                                    <div>
                                        <div className="font-medium">Henry Rollins</div>
                                        <div className="text-xs text-gray-400">Support</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">20</div>
                            </li>

                            {/* more items... */}
                        </ul>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm font-medium">Top earning</div>
                            <button className="text-xs text-gray-500 border px-2 py-1 rounded">This month</button>
                        </div>

                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded p-2 bg-green-50">💼</div>
                                    <div>
                                        <div className="font-medium">Development</div>
                                        <div className="text-xs text-gray-400">72 completed tasks</div>
                                    </div>
                                </div>
                                <div className="font-medium">$3,340.21</div>
                            </li>

                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded p-2 bg-blue-50">📁</div>
                                    <div>
                                        <div className="font-medium">Directions</div>
                                        <div className="text-xs text-gray-400">57 completed tasks</div>
                                    </div>
                                </div>
                                <div className="font-medium">$2,800.30</div>
                            </li>

                            {/* ... */}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
