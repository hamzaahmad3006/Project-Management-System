import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Tasks from './Tasks'
import Projects from './Projects'
import Calendar from './Calendar'
import Reports from './Reports'
import Team from 'pages/Dashboard/Team/Team'
import ProjectBoard from './ProjectBoard'
import Sidebar from 'components/Layout/Sidebar'
import DashboardTab from 'pages/Dashboard/Team/DashboardTab'
import ProjectTab from 'pages/Dashboard/Team/ProjectTab'
import MembersTab from 'pages/Dashboard/Team/Members'

export default function Dashboard() {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-[#12141c]">
                <Routes>
                    <Route index element={< Home />} />
                    <Route path="tasks" element={< Tasks />} />
                    <Route path="projects" element={< Projects />} />
                    <Route path="calendar" element={< Calendar />} />
                    <Route path="reports" element={< Reports />} />

                    <Route path="team" element={<Team />}>
                        <Route index element={<ProjectTab />} />
                        <Route path="dashboard" element={<DashboardTab />} />
                        <Route path="members" element={<MembersTab />} />
                    </Route>

                    <Route path="board" element={< ProjectBoard />} />
                </Routes>
            </div>
        </div>
    )
}