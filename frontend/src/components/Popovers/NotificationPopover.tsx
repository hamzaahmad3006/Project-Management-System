import React, { useEffect } from 'react';
import { FaFilePdf, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationPopoverProps } from '../../types';
import { RootState, AppDispatch } from '../../store/store';
import { fetchNotifications, markNotificationAsRead, acceptTeamInvitation, declineTeamInvitation } from '../../store/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose, leftOffset = 80 }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, loading } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    }, [isOpen, dispatch]);

    if (!isOpen) return null;

    const handleAccept = async (token: string, notificationId: string) => {
        try {
            await dispatch(acceptTeamInvitation(token)).unwrap();
            await dispatch(markNotificationAsRead(notificationId));
            alert("Invitation accepted successfully!");
        } catch (error: any) {
            alert(error || "Failed to accept invitation");
        }
    };

    const handleDecline = async (token: string, notificationId: string) => {
        try {
            await dispatch(declineTeamInvitation(token)).unwrap();
            await dispatch(markNotificationAsRead(notificationId));
            alert("Invitation declined.");
        } catch (error: any) {
            alert(error || "Failed to decline invitation");
        }
    };

    return (
        <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose}></div>

            {/* Popover Content */}
            <div
                className="fixed top-4 bottom-4 w-[450px] bg-white dark:bg-[#1a1c23] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans animate-in slide-in-from-left-4 duration-200 border border-gray-100 dark:border-gray-800"
                style={{ left: `${leftOffset + 16}px` }}
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1c23] sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Notifications</h3>
                    <button
                        onClick={() => notifications.forEach(n => !n.isRead && dispatch(markNotificationAsRead(n.id)))}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1a1c23]">
                    {loading && notifications.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Loading notifications...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center gap-4">
                            <span className="text-4xl opacity-20">🔔</span>
                            <span className="text-sm font-medium">No notifications yet</span>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className="p-5 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors relative group">
                                {/* Blue dot for unread */}
                                {!notif.isRead && (
                                    <div className="absolute top-6 right-5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                )}

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <FaUserCircle className="text-gray-400 dark:text-gray-500 text-3xl" />
                                    </div>

                                    <div className="flex-1 space-y-1.5">
                                        <div className="text-[14px] leading-relaxed">
                                            <span className="font-bold text-gray-900 dark:text-gray-100">{notif.title}</span>{' '}
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{notif.message}</span>
                                        </div>

                                        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </div>

                                        {/* Type: TEAM_INVITATION (Accept/Decline) */}
                                        {notif.type === 'TEAM_INVITATION' && !notif.isRead && (
                                            <div className="flex gap-3 pt-3">
                                                <button
                                                    onClick={() => handleAccept(notif.data.token, notif.id)}
                                                    className="px-6 py-1.5 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 dark:text-gray-900 text-xs font-bold rounded shadow-sm transition-all transform active:scale-95"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(notif.data.token, notif.id)}
                                                    className="px-6 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform active:scale-95"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPopover;

