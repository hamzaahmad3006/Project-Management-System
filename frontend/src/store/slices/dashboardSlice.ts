import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface DashboardState {
    kpis: {
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            canceled: number;
            overdue: number;
        };
        projects: {
            active: number;
            totalBudget: number;
            totalSpent: number;
        };
        chartData: any[];
        initialSpend: number;
    } | null;
    recentActivity: any[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    kpis: null,
    recentActivity: [],
    loading: false,
    error: null,
};

// Fetch KPIs
export const fetchKPIs = createAsyncThunk(
    'dashboard/fetchKPIs',
    async (projectId: string | undefined, { rejectWithValue }) => {
        try {
            const params = projectId && projectId !== 'all' ? { projectId } : {};
            const response = await api.get('/dashboard/kpis', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch KPIs');
        }
    }
);

// Fetch Recent Activity
export const fetchRecentActivity = createAsyncThunk(
    'dashboard/fetchRecentActivity',
    async (projectId: string | undefined, { rejectWithValue }) => {
        try {
            const params = projectId && projectId !== 'all' ? { projectId } : {};
            const response = await api.get('/dashboard/recent-activity', { params });
            return response.data.recentActivity;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activity');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch KPIs
            .addCase(fetchKPIs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKPIs.fulfilled, (state, action) => {
                state.loading = false;
                state.kpis = action.payload;
            })
            .addCase(fetchKPIs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Recent Activity
            .addCase(fetchRecentActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecentActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.recentActivity = action.payload;
            })
            .addCase(fetchRecentActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
