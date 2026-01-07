import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { addNotification } from '../slices/notificationSlice';
import { receiveComment } from '../slices/commentSlice';
import { toast } from 'react-toastify';
import { Notification, Comment } from 'types';

interface MiddlewareState {
    auth: {
        token: string | null;
        isAuthenticated: boolean;
    };
    tasks: {
        currentTask: { id: string } | null;
    };
}

let socket: Socket | null = null;

export const socketMiddleware: Middleware<{}, MiddlewareState> = (store) => (next) => (action) => {
    const { dispatch, getState } = store;
    const state = getState();
    const auth = state.auth;
    const { token, isAuthenticated } = auth || {};


    if (isAuthenticated && token) {
        if (!socket) {


            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const socketUrl = new URL(apiUrl).origin;

            socket = io(socketUrl, {
                auth: { token },
                transports: ['websocket'],
            });

            socket.on('connect', () => {
                console.log(' Socket connected via Middleware:', socket?.id);
            });

            socket.on('connect_error', (err) => {
                console.error(' Socket connection error (Middleware):', err.message);
            });

            socket.on('disconnect', (reason) => {
                console.log(' Socket disconnected (Middleware):', reason);
            });

            socket.on('new_notification', (notification: Notification) => {
                dispatch(addNotification(notification));
                toast.info(notification.message);
            });

            socket.on('new_comment', (data: { taskId: string; comment: Comment }) => {
                const { tasks } = store.getState();
                if (tasks.currentTask && tasks.currentTask.id === data.taskId) {
                    dispatch(receiveComment(data.comment));
                }
            });
        }
    } else {
        if (socket) {
            console.log('🔌 Redux Middleware: Disconnecting socket');
            socket.disconnect();
            socket = null;
        }
    }

    return next(action);
};
