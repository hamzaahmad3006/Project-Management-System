import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { AxiosError } from 'axios';
import { DashboardState } from 'types';

const initialState: DashboardState = {
  kpis: null,
  recentActivity: [],
  loading: false,
  error: null,
};

export const fetchKPIs = createAsyncThunk(
  'dashboard/fetchKPIs',
  async (
    args: { projectId?: string; year?: string; date?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, string> =
        args?.projectId && args.projectId !== 'all' ? { projectId: args.projectId } : {};
      if (args?.year) params.year = args.year;
      if (args?.date) params.date = args.date;

      const response = await api.get('/dashboard/kpis', { params });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch KPIs');
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (args: { projectId?: string; date?: string } | undefined, { rejectWithValue }) => {
    try {
      const params: Record<string, string> =
        args?.projectId && args.projectId !== 'all' ? { projectId: args.projectId } : {};
      if (args?.date) params.date = args.date;

      const response = await api.get('/dashboard/recent-activity', { params });
      return response.data.recentActivity;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent activity');
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
