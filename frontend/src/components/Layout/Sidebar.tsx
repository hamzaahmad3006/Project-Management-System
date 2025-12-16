import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CreateProjectModal from '../Modals/CreateProjectModal';
import InviteTeammatesModal from '../Modals/InviteTeammatesModal';
import CreateTeamModal from '../Modals/CreateTeamModal';
import SettingsModal from '../Modals/SettingsModal';
import SearchModal from '../Modals/SearchModal';
import NotificationPopover from '../Popovers/NotificationPopover';
import { FaSearch, FaBell, FaChevronRight, FaChevronDown, FaUserPlus, FaCog, FaBars, FaTimes, FaRegCheckCircle, FaRegFile, FaPlus, } from 'react-icons/fa';
import { logout } from 'store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { MdLogout } from 'react-icons/md';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
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
                    fixed md:sticky top-0 h-screen bg-[#FAFAFA] border-r border-gray-200
                    transition-all duration-300 z-40
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {isOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-sm">
                                ❖
                            </div>
                            <span className="font-semibold text-gray-800">Defcon systems</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 hover:bg-gray-200 rounded hidden md:block"
                    >
                        <img src='/assets/SidebarIcon.png' alt="Logo" />
                    </button>
                </div>

                <nav className="p-3 space-y-1">
                    <div
                        onClick={() => setIsSearchOpen(true)}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer ${!isOpen && 'justify-center'}`}
                    >
                        <FaSearch size={16} />
                        {isOpen && <span className="text-sm">Search</span>}
                    </div>

                    <div
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer ${!isOpen && 'justify-center'} ${isNotificationOpen ? 'bg-gray-200 text-gray-900' : ''}`}
                    >
                        <FaBell size={16} />
                        {isOpen && <span className="text-sm">Notifications</span>}
                    </div>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'
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
                                        console.log('Plus icon wrapper clicked!');
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
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">
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
                    console.log('Sidebar: CreateTeamModal onClose triggered');
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
