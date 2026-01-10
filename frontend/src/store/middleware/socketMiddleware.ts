import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { addNotification } from '../slices/notificationSlice';
import { receiveComment } from '../slices/commentSlice';
import { receiveSubtask, updateSubtaskStatus, setSelectedTask } from '../slices/taskSlice';
import { toast } from 'react-toastify';
import { Notification, Comment, Subtask } from 'types';

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

            socket.on('subtask_added', (subtask: Subtask) => {
                dispatch(receiveSubtask(subtask));
            });

            socket.on('subtask_updated', (subtask: Subtask) => {
                dispatch(updateSubtaskStatus(subtask));
            });
        }
    } else {
        if (socket) {
            console.log('🔌 Redux Middleware: Disconnecting socket');
            socket.disconnect();
            socket = null;
        }
    }


    if (setSelectedTask.match(action)) {
        const previousTask = state.tasks.currentTask;
        const newTask = action.payload;

        if (socket) {
            if (previousTask) {
                socket.emit('leave_task', previousTask.id);
            }
            if (newTask && newTask.id) {
                socket.emit('join_task', newTask.id);
            }
        }
    }

    return next(action);
};
