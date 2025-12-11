import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function Team() {
    const { teamId } = useParams(); // optional if you want team name in header



    return (
        <div className="flex w-full h-screen bg-white">


            {/* Main area */}
            <main className="flex-1 p-8 overflow-auto">
                {/* Header (team name) */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Defcon / Directions</h1>
                        <div className="text-sm text-gray-500">Teamspace overview</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border rounded text-sm">Share</button>
                        <button className="px-4 py-1 bg-blue-500 text-white rounded">Create</button>
                    </div>
                </div>

                {/* Top tabs (projects / dashboard / members / files) */}
                <div className="mb-6 border-b">
                    <nav className="flex gap-6 text-sm">
                        <NavLink
                            to="."
                            end
                            className={({ isActive }) =>
                                isActive ? "pb-3 border-b-2 border-black font-medium" : "pb-3 text-gray-500 hover:text-black"
                            }
                        >
                            Projects
                        </NavLink>

                        <NavLink
                            to="dashboard"
                            className={({ isActive }) =>
                                isActive ? "pb-3 border-b-2 border-black font-medium" : "pb-3 text-gray-500 hover:text-black"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="members"
                            className={({ isActive }) =>
                                isActive ? "pb-3 border-b-2 border-black font-medium" : "pb-3 text-gray-500 hover:text-black"
                            }
                        >
                            Members
                        </NavLink>

                        <NavLink
                            to="files"
                            className={({ isActive }) =>
                                isActive ? "pb-3 border-b-2 border-black font-medium" : "pb-3 text-gray-500 hover:text-black"
                            }
                        >
                            Files
                        </NavLink>
                    </nav>
                </div>

                {/* Outlet will render Projects / Dashboard / Members / Files */}
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
