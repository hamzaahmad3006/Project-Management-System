import React from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { NotificationPopoverProps } from '../../types';

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose, leftOffset = 80 }) => {
    if (!isOpen) return null;

    const notifications = [
        {
            id: 1,
            user: "Olivia Haze",
            avatar: "https://i.pravatar.cc/150?u=1",
            action: "joined the project",
            target: "Marketing",
            time: "1 min ago",
            project: "Defcon systems",
            type: "simple",
            unread: true
        },
        {
            id: 2,
            user: "Hanna Wayne",
            avatar: "https://i.pravatar.cc/150?u=2",
            action: "wants to edit project",
            target: "Directions",
            time: "5 min ago",
            project: "Defcon systems",
            type: "request",
            unread: true
        },
        {
            id: 3,
            user: "Greg Rodrigues",
            avatar: "https://i.pravatar.cc/150?u=3",
            action: "commented in",
            target: "Directions",
            time: "30 min ago",
            project: "Defcon systems",
            type: "comment",
            content: "A tutorial would be cool. Unsure if people can see each others schedules without being admin?",
            unread: false
        },
        {
            id: 4,
            user: "Olivia Haze",
            avatar: "https://i.pravatar.cc/150?u=1",
            action: "shared a file in",
            target: "Marketing",
            time: "1 hour ago",
            project: "Defcon systems",
            type: "file",
            file: "Landing_draft.pdf",
            fileType: "PDF-Download",
            unread: false
        },
        {
            id: 5,
            user: "Valery Shane",
            avatar: "https://i.pravatar.cc/150?u=4",
            action: "marked 10 tasks complete in",
            target: "BilldCorp",
            time: "1 day ago",
            project: "Defcon systems",
            type: "simple",
            unread: false
        },
        {
            id: 6,
            user: "Olivia Haze",
            avatar: "https://i.pravatar.cc/150?u=1",
            action: "wants to edit project",
            target: "Directions",
            time: "2 days ago",
            project: "Defcon systems",
            type: "request",
            unread: false
        }
    ];

    return (
        <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose}></div>

            {/* Popover Content */}
            <div
                className="fixed top-4 bottom-4 w-[450px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans animate-in slide-in-from-left-4 duration-200 border border-gray-100"
                style={{ left: `${leftOffset + 16}px` }}
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0">
                    <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
                    <button className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                        Mark all as read
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group">
                            {/* Blue dot for unread */}
                            {notif.unread && (
                                <div className="absolute top-6 right-5 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}

                            <div className="flex gap-4">
                                <img
                                    src={notif.avatar}
                                    alt={notif.user}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />

                                <div className="flex-1 space-y-1">
                                    <div className="text-[15px] leading-snug">
                                        <span className="font-semibold text-gray-900">{notif.user}</span>{' '}
                                        <span className="text-gray-600">{notif.action}</span>{' '}
                                        <span className="font-medium text-gray-900">{notif.target}</span>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        {notif.time} <span className="text-gray-300">•</span> {notif.project}
                                    </div>

                                    {/* Type: Request (Approve/Deny) */}
                                    {notif.type === 'request' && (
                                        <div className="flex gap-3 pt-2">
                                            <button className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors shadow-sm shadow-blue-200">
                                                Approve
                                            </button>
                                            <button className="px-5 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded hover:bg-gray-100 transition-colors">
                                                Deny
                                            </button>
                                        </div>
                                    )}

                                    {/* Type: Comment */}
                                    {notif.type === 'comment' && (
                                        <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-200">
                                            {notif.content}
                                        </div>
                                    )}

                                    {/* Type: File */}
                                    {notif.type === 'file' && (
                                        <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors cursor-pointer group/file">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaFilePdf className="text-red-500 text-xl" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-800 group-hover/file:text-blue-600 transition-colors">{notif.file}</div>
                                                <div className="text-xs text-gray-400">{notif.fileType}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NotificationPopover;
