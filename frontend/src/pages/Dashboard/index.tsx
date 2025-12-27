import { Route, Routes } from 'react-router-dom'
import Home from './home/Home'
import Tasks from './tasks/Tasks'
import Projects from './Projects'
import Calendar from './Calendar'
import Reports from './Reports'
import Team from 'pages/dashboard/team/Team'
import ProjectBoard from './projectBoard/ProjectBoard'
import Sidebar from 'components/layout/Sidebar'
import DashboardTab from 'pages/dashboard/team/DashboardTab'
import ProjectTab from 'pages/dashboard/team/ProjectTab'
import MembersTab from 'pages/dashboard/team/MembersTab'
import FilesTab from 'pages/dashboard/team/FilesTab'

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
                        <Route path="files" element={<FilesTab />} />
                    </Route>

                    <Route path="board" element={< ProjectBoard />} />
                </Routes>
            </div>
        </div>
    )
}