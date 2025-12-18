import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications');
            return response.data.notifications;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.put(`/notifications/${id}/read`);
            return response.data.notification;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
        }
    }
);

export const acceptTeamInvitation = createAsyncThunk(
    'notifications/acceptInvitation',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/teams/invitation/${token}/accept`);
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to accept invitation');
        }
    }
);

export const declineTeamInvitation = createAsyncThunk(
    'notifications/declineInvitation',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/teams/invitation/${token}/decline`);
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to decline invitation');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            });
    },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
