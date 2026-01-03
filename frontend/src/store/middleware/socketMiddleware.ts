import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { addNotification } from '../slices/notificationSlice';
import { receiveComment } from '../slices/commentSlice';
import { toast } from 'react-toastify';

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
    const { dispatch, getState } = store;
    const state = getState();
    const { token, isAuthenticated } = state.auth;

    // Handle connection logic
    if (isAuthenticated && token) {
        if (!socket) {
            console.log('🔗 Redux Middleware: Initializing Socket.io connection');

            // Fix: Strip /api or other paths from the URL to avoid "Invalid namespace" error
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const socketUrl = new URL(apiUrl).origin;

            socket = io(socketUrl, {
                auth: { token },
                transports: ['websocket'],
            });

            socket.on('connect', () => {
                console.log('✅ Socket connected via Middleware:', socket?.id);
            });

            socket.on('connect_error', (err) => {
                console.error('❌ Socket connection error (Middleware):', err.message);
            });

            socket.on('disconnect', (reason) => {
                console.log('⚠️ Socket disconnected (Middleware):', reason);
            });

            socket.on('new_notification', (notification) => {
                console.log('🔔 New notification received (Middleware):', notification);
                dispatch(addNotification(notification));
                toast.info(notification.message);
            });

            socket.on('new_comment', (data: { taskId: string; comment: any }) => {
                console.log('💬 New comment received (Middleware):', data);
                // Get current task from tasks state
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
