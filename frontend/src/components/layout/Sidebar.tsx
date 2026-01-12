import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import CreateProjectModal from '../modals/createProjectModal/CreateProjectModal';
import InviteTeammatesModal from '../modals/inviteTeammatesModal/InviteTeammatesModal';
import CreateTeamModal from '../modals/createTeamModal/CreateTeamModal';
import SettingsModal from '../modals/settingsModal/SettingsModal';
import SearchModal from '../modals/searchModal/SearchModal';
import NotificationPopover from '../modals/notificationModal/NotificationModal';
import { FaSearch, FaBell, FaUserPlus, FaCog, FaBars, FaTimes, FaRegCheckCircle, FaRegFile, FaPlus, } from 'react-icons/fa';
import { logout } from 'store/slices/authSlice';
import { fetchProjects, setSelectedProjectId } from '../../store/slices/projectSlice';
import { getTeams } from '../../store/slices/teamSlice';
import { MdLogout } from 'react-icons/md';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { notifications } = useSelector((state: RootState) => state.notifications);
    const { allTeams } = useSelector((state: RootState) => state.team);
    const { projects, selectedProjectId } = useSelector((state: RootState) => state.projects);
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const isManager = user?.role === 'MANAGER';
    const [isMobileDesignExpanded, setIsMobileDesignExpanded] = useState(true);
    const [isTeamSubExpanded, setIsTeamSubExpanded] = useState(false);
    const [isDiadoraExpanded, setIsDiadoraExpanded] = useState(true);
    const [isProjectSubExpanded, setIsProjectSubExpanded] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchNotifications());
        dispatch(fetchProjects());
        dispatch(getTeams());
    }, [dispatch]);

    useEffect(() => {

    }, [isCreateTeamOpen]);

    // Check if user is a member of any team
    const hasTeamMembership = () => {
        return user?.teamMemberships && user.teamMemberships.length > 0;
    };

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            <aside
                className={`
                    fixed md:sticky top-0 h-screen bg-gray-50 dark:bg-surface-card border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 z-40 flex flex-col
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    {isOpen && (
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-sm">
                                ❖
                            </div>
                            <span className="font-semibold text-content-primary dark:text-gray-100">Defcon systems</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded md:block"
                    >
                        <img src="/assets/collapse.svg" alt="" className="w-4 h-4 text-gray-600 dark:text-gray-400" />

                    </button>
                </div>


                <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
                    <div
                        onClick={() => setIsSearchOpen(true)}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer ${!isOpen && 'justify-center'}`}
                    >
                        <FaSearch size={16} />
                        {isOpen && <span className="text-sm">Search</span>}
                    </div>

                    <div
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer relative ${!isOpen && 'justify-center'} ${isNotificationOpen ? 'bg-gray-200 text-gray-900' : ''}`}
                    >
                        <div className="relative">
                            <FaBell size={16} />
                            {unreadCount > 0 && (
                                <span className={`absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ${!isOpen && 'top-0 right-0'}`}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        {isOpen && <span className="text-sm">Notifications</span>}
                    </div>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive
                                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                            } ${!isOpen && 'justify-center'}`
                        }
                    >
                        <FaRegCheckCircle size={16} />
                        {isOpen && <span className="text-sm">Tasks</span>}
                    </NavLink>

                    {isManager && (
                        <div
                            onClick={() => setIsCreateProjectOpen(true)}
                            className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer ${!isOpen && 'justify-center'}`}
                        >
                            <FaRegFile size={16} />
                            {isOpen && <span className="text-sm">Create Project</span>}
                        </div>
                    )}

                    {isOpen && (
                        <>
                            <div className="pt-4 pb-2 px-3 flex items-center justify-between group">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Teamspaces</span>
                                {isManager && (
                                    <div
                                        className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                        onClick={() => setIsCreateTeamOpen(true)}
                                    >
                                        <FaPlus size={10} className="text-gray-500" />
                                    </div>
                                )}
                            </div>

                            {/* Mobile App Section */}
                            <div>
                                <div
                                    onClick={() => {
                                        const newStates = !isMobileDesignExpanded;
                                        setIsMobileDesignExpanded(newStates);
                                        if (newStates) setIsDiadoraExpanded(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer"
                                >
                                    {isMobileDesignExpanded ? <img src="/assets/chevronDown.svg" alt="" className="w-6 h-6" /> : <img src="/assets/collapseRight.svg" alt="" className="w-5 h-5" />}
                                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center rounded text-[10px] font-bold">M</div>
                                    <span className="text-sm font-medium">Mobile app: design</span>
                                </div>

                                {isMobileDesignExpanded && (
                                    <div className="ml-9 mt-1 space-y-1">
                                        <div className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">Intro</div>

                                        {/* Nested Team Folder */}
                                        <div>
                                            <div
                                                onClick={() => {
                                                    if (!hasTeamMembership()) {
                                                        window.toastify("You are not a member of any team yet. Please wait for a manager to add you to a team.", "warning");
                                                        return;
                                                    }
                                                    setIsTeamSubExpanded(!isTeamSubExpanded);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                            >
                                                {isTeamSubExpanded ? <img src="/assets/chevronDown.svg" alt="" className="w-6 h-6" /> : <img src="/assets/collapseRight.svg" alt="" className="w-5 h-5" />}
                                                Team
                                            </div>
                                            {isTeamSubExpanded && (
                                                <div className="ml-4 mt-1 space-y-1 border-l border-gray-100 dark:border-gray-800 max-h-[200px] overflow-y-auto no-scrollbar">
                                                    {allTeams.map(team => (
                                                        <NavLink
                                                            key={team.id}
                                                            to={`/team/${team.id}`}
                                                            className={({ isActive }) =>
                                                                `block pl-4 py-1.5 text-xs rounded transition-colors ${isActive
                                                                    ? 'text-brand-primary font-medium'
                                                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                                                                }`
                                                            }
                                                        >
                                                            {team.name}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2">
                                <div
                                    onClick={() => {
                                        const newStates = !isDiadoraExpanded;
                                        setIsDiadoraExpanded(newStates);
                                        if (newStates) setIsMobileDesignExpanded(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer"
                                >
                                    {isDiadoraExpanded ? <img src="/assets/chevronDown.svg" alt="" className="w-6 h-6" /> : <img src="/assets/collapseRight.svg" alt="" className="w-5 h-5" />}
                                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center rounded text-[10px] font-bold">D</div>
                                    <span className="text-sm font-medium">Diadora scoup</span>
                                </div>

                                {isDiadoraExpanded && (
                                    <div className="ml-9 mt-1 space-y-1">
                                        <div className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">Ideas and details</div>

                                        <div>
                                            <div
                                                onClick={() => {
                                                    if (!hasTeamMembership()) {
                                                        window.toastify("You need to be part of a team to access projects. Please wait for a manager to add you to a team.", "warning");
                                                        return;
                                                    }
                                                    setIsProjectSubExpanded(!isProjectSubExpanded);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                            >
                                                {isProjectSubExpanded ? <img src="/assets/chevronDown.svg" alt="" className="w-6 h-6" /> : <img src="/assets/collapseRight.svg" alt="" className="w-5 h-5" />}
                                                Projects
                                            </div>
                                            {isProjectSubExpanded && (
                                                <div className="ml-4 mt-1 space-y-1 border-l border-gray-100 dark:border-gray-800 max-h-[200px] overflow-y-auto no-scrollbar">
                                                    {projects.map(project => (
                                                        <NavLink
                                                            key={project.id}
                                                            to="/board"
                                                            onClick={() => dispatch(setSelectedProjectId(project.id))}
                                                            className={({ isActive }) =>
                                                                `block pl-4 py-1.5 text-xs rounded transition-colors ${selectedProjectId === project.id
                                                                    ? 'text-brand-primary font-medium'
                                                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                                                                }`
                                                            }
                                                        >
                                                            {project.name}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">Design References</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>


                <div className="mt-auto w-full border-t border-gray-200 dark:border-gray-800 p-3 space-y-1 bg-gray-50 dark:bg-surface-card">
                    {isOpen && isManager && (
                        <div
                            onClick={() => setIsInviteOpen(true)}
                            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer"
                        >
                            <FaUserPlus size={16} />
                            <span className="text-sm">Invite teammates</span>
                        </div>
                    )}


                    <div
                        onClick={() => setIsSettingsOpen(true)}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer ${!isOpen && "justify-center"
                            }`}>
                        <FaCog size={16} />
                        {isOpen && <span className="text-sm">Setting</span>}
                    </div>

                    <div
                        onClick={() => dispatch(logout())}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer ${!isOpen && "justify-center"
                            }`}>
                        <MdLogout size={16} />
                        {isOpen && <span className="text-sm">Logout</span>}
                    </div>
                </div>

            </aside>

            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}

            <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
            <InviteTeammatesModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
            <CreateTeamModal
                isOpen={isCreateTeamOpen}
                onClose={() => {
                    setIsCreateTeamOpen(false);
                }}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
            <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                leftOffset={isOpen ? 256 : 80}
            />
        </>
    );
};

export default Sidebar;
