import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchNotifications, markNotificationAsRead, acceptTeamInvitation, declineTeamInvitation } from '../../../store/slices/notificationSlice';
import { Notification } from '../../../types';

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
            window.toastify("Invitation accepted successfully!", "success");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            window.toastify(error.response?.data?.message || "Failed to accept invitation", "error");
        }
    };

    const handleDecline = async (token: string, notificationId: string) => {
        try {
            await dispatch(declineTeamInvitation(token)).unwrap();
            await dispatch(markNotificationAsRead(notificationId));
            window.toastify("Invitation declined.", "success");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            window.toastify(error.response?.data?.message || "Failed to decline invitation", "error");
        }
    };

    const handleMarkAllAsRead = () => {
        notifications.forEach((n: Notification) => {
            if (!n.isRead) {
                dispatch(markNotificationAsRead(n.id));
            }
        });
    };

    return {
        notifications,
        loading,
        handleAccept,
        handleDecline,
        handleMarkAllAsRead
    };
};