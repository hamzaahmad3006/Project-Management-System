import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchNotifications, markNotificationAsRead, acceptTeamInvitation, declineTeamInvitation } from '../../../store/slices/notificationSlice';
import { fetchTaskById, setSelectedTask } from '../../../store/slices/taskSlice';
import { Notification } from '../../../types';
import { toast } from 'react-toastify';

export const useNotificationHook = (isOpen: boolean, onClose: () => void) => {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, loading } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    }, [isOpen, dispatch]);

    const handleAccept = async (token: string, notificationId: string) => {
        try {
            await dispatch(acceptTeamInvitation(token)).unwrap();
            await dispatch(markNotificationAsRead(notificationId));
            toast.success("Invitation accepted successfully!");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to accept invitation");
        }
    };

    const handleDecline = async (token: string, notificationId: string) => {
        try {
            await dispatch(declineTeamInvitation(token)).unwrap();
            await dispatch(markNotificationAsRead(notificationId));
            toast.success("Invitation declined.");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to decline invitation");
        }
    };

    const handleMarkAllAsRead = () => {
        notifications.forEach((n: Notification) => {
            if (!n.isRead) {
                dispatch(markNotificationAsRead(n.id));
            }
        });
    };

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            dispatch(markNotificationAsRead(notif.id));
        }

        if (notif.type === 'NEW_COMMENT' && notif.data?.taskId) {
            // Set partial task immediately to trigger modal opening
            dispatch(setSelectedTask({ id: notif.data.taskId } as any));
            dispatch(fetchTaskById(notif.data.taskId) as any);
            onClose();
        }
    };

    return {
        notifications,
        loading,
        handleAccept,
        handleDecline,
        handleMarkAllAsRead,
        handleNotificationClick
    };
};