import React from "react";

export default function ProjectTab() {
    const data = [
        {
            name: "Development",
            status: "On track",
            statusColor: "bg-green-100 text-green-600",
            progress: 80,
            due: "Mar 1, 2025",
            priority: "High",
            prColor: "bg-red-100 text-red-600",
            members: 4,
        },
        {
            name: "Directions",
            status: "At risk",
            statusColor: "bg-orange-100 text-orange-600",
            progress: 40,
            due: "Nov 20, 2025",
            priority: "Medium",
            prColor: "bg-yellow-100 text-yellow-600",
            members: 5,
        },
        {
            name: "Product calendar",
            status: "At risk",
            statusColor: "bg-orange-100 text-orange-600",
            progress: 40,
            due: "Nov 20, 2025",
            priority: "High",
            prColor: "bg-red-100 text-red-600",
            members: 3,
        },
        {
            name: "Design references",
            status: "On track",
            statusColor: "bg-green-100 text-green-600",
            progress: 70,
            due: "Nov 20, 2025",
            priority: "Low",
            prColor: "bg-green-100 text-green-600",
            members: 3,
        },
        {
            name: "QA and review",
            status: "On hold",
            statusColor: "bg-blue-100 text-blue-600",
            progress: 70,
            due: "Sep 20, 2024",
            priority: "Low",
            prColor: "bg-green-100 text-green-600",
            members: 3,
        },
    ];

    return (
        <div className="flex w-full h-screen bg-white">


            {/* RIGHT MAIN CONTENT */}
            <main className="flex-1 p-10">


                {/* PROJECT TABLE */}
                <div className="border rounded-xl overflow-hidden shadow-sm ">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Task progress</th>
                                <th className="text-left p-3">Due date</th>
                                <th className="text-left p-3">Priority</th>
                                <th className="text-left p-3">Members</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{item.name}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${item.statusColor}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <div className="w-32 bg-gray-200 h-2 rounded-full">
                                            <div
                                                className="h-2 bg-blue-500 rounded-full"
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    </td>

                                    <td className="p-3">{item.due}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${item.prColor}`}
                                        >
                                            {item.priority}
                                        </span>
                                    </td>

                                    <td className="p-3 flex items-center -space-x-2">
                                        {[...Array(item.members)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                                            ></div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
