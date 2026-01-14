import { Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import Tasks from './tasks/Tasks';

import Team from 'pages/dashboard/team/Team';
import ProjectBoard from './projectBoard/ProjectBoard';
import Sidebar from 'components/layout/Sidebar';
import DashboardTab from 'pages/dashboard/team/DashboardTab';
import ProjectTab from 'pages/dashboard/team/ProjectTab';
import MembersTab from 'pages/dashboard/team/MembersTab';
import FilesTab from 'pages/dashboard/team/FilesTab';
import TaskDetailPanel from 'components/dashboard/TaskDetailPanel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { clearCurrentTask } from 'store/slices/taskSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { currentTask } = useAppSelector((state) => state.tasks);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#12141c]">
        <Routes>
          <Route index element={<Home />} />
          <Route path="tasks" element={<Tasks />} />

          <Route path="team/:teamId?" element={<Team />}>
            <Route index element={<ProjectTab />} />
            <Route path="dashboard" element={<DashboardTab />} />
            <Route path="members" element={<MembersTab />} />
            <Route path="files" element={<FilesTab />} />
          </Route>

          <Route path="board" element={<ProjectBoard />} />
        </Routes>
      </div>

      {currentTask && (
        <TaskDetailPanel task={currentTask} onClose={() => dispatch(clearCurrentTask())} />
      )}
    </div>
  );
}
