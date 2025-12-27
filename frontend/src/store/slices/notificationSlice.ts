import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { Notification, NotificationState } from '../../types';

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ notifications: Notification[] }>('/notifications');
            return response.data.notifications;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch notifications');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.put<{ notification: Notification }>(`/notifications/${id}/read`);
            return response.data.notification;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to mark as read');
        }
    }
);

export const acceptTeamInvitation = createAsyncThunk(
    'notifications/acceptInvitation',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.get<{ message: string }>(`/teams/invitation/${token}/accept`);
            return response.data.message;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to accept invitation');
        }
    }
);

export const declineTeamInvitation = createAsyncThunk(
    'notifications/declineInvitation',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.get<{ message: string }>(`/teams/invitation/${token}/decline`);
            return response.data.message;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to decline invitation');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            // Add new notification to the beginning of the list
            state.notifications.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
                const index = state.notifications.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            });
    },
});

export const { clearError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
