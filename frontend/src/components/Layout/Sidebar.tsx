import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import CreateProjectModal from '../Modals/CreateProjectModal';
import InviteTeammatesModal from '../Modals/InviteTeammatesModal';
import CreateTeamModal from '../Modals/CreateTeamModal';
import SettingsModal from '../Modals/SettingsModal';
import SearchModal from '../Modals/SearchModal';
import NotificationPopover from '../Popovers/NotificationPopover';
import { FaSearch, FaBell, FaChevronRight, FaChevronDown, FaUserPlus, FaCog, FaBars, FaTimes, FaRegCheckCircle, FaRegFile, FaPlus, } from 'react-icons/fa';
import { logout } from 'store/slices/authSlice';
import { fetchProjects, setSelectedProjectId } from '../../store/slices/projectSlice';
import { MdLogout } from 'react-icons/md';
import { PanelLeft, LayoutGrid } from 'lucide-react';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { notifications } = useSelector((state: RootState) => state.notifications);
    const { projects, selectedProjectId } = useSelector((state: RootState) => state.projects);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const isManager = user?.role === 'MANAGER';
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedTeamspace, setExpandedTeamspace] = useState('mobile-app');
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchNotifications());
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        console.log('Sidebar - isCreateTeamOpen changed to:', isCreateTeamOpen);
    }, [isCreateTeamOpen]);



    const teamspaces = [
        {
            id: 'mobile-app',
            name: 'Mobile app: design',
            items: [
                { name: 'Intro', path: '/intro' },
                { name: 'Team', path: '/team' },
                { name: 'Process', path: '/process' },
                { name: 'HR', path: '/hr' }
            ]
        },
        {
            id: 'diadora',
            name: 'Diadora scoup',
            items: [
                { name: 'Ideas and details', path: '/ideas' },
                { name: 'Project Board [2023]', path: '/board' },
                { name: 'Design References', path: '/references' },
                { name: 'QA and review', path: '/qa' }
            ]
        }
    ];

    const toggleTeamspace = (id: string) => {
        setExpandedTeamspace(expandedTeamspace === id ? '' : id);
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
                    fixed md:sticky top-0 h-screen bg-[#FAFAFA] dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 z-40
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
                            <span className="font-semibold text-gray-800 dark:text-gray-100">Defcon systems</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded md:block"
                    >
                        <PanelLeft size={20} />

                    </button>
                </div>


                <nav className="p-3 space-y-1">
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
                                <div
                                    className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setIsCreateTeamOpen(true);
                                    }}
                                >
                                    <FaPlus size={10} className="text-gray-500" />
                                </div>
                            </div>

                            {teamspaces.map((teamspace) => (
                                <div key={teamspace.id}>
                                    <div
                                        onClick={() => toggleTeamspace(teamspace.id)}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer"
                                    >
                                        {expandedTeamspace === teamspace.id ? (
                                            <FaChevronDown size={12} />
                                        ) : (
                                            <FaChevronRight size={12} />
                                        )}
                                        <span className="text-sm font-medium">{teamspace.name}</span>
                                    </div>

                                    {expandedTeamspace === teamspace.id && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {teamspace.items.map((item) => (
                                                <NavLink
                                                    key={item.path}
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `block px-3 py-1.5 text-sm rounded transition-colors ${isActive
                                                            ? 'bg-gray-200 text-gray-900'
                                                            : 'text-gray-600 hover:bg-gray-200'
                                                        }`
                                                    }
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </nav>


                <div className="absolute bottom-0 w-full border-t border-gray-200 p-3 space-y-1">
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
