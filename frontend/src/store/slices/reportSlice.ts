import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { AxiosError } from 'axios';

interface ProductivityData {
  name: string;
  completedTasks: number;
  createdTasks: number;
  score: number;
}

interface PerformanceData {
  total: number;
  byStatus: { status: string; _count: { _all: number } }[];
  byPriority: { priority: string; _count: { _all: number } }[];
}

interface ReportState {
  productivity: ProductivityData[];
  performance: PerformanceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  productivity: [],
  performance: null,
  loading: false,
  error: null,
};

export const fetchProductivity = createAsyncThunk(
  'reports/fetchProductivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/productivity');
      return response.data.productivity;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch productivity');
    }
  }
);

export const fetchPerformance = createAsyncThunk(
  'reports/fetchPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/performance');
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch performance');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductivity.fulfilled, (state, action) => {
        state.productivity = action.payload;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      });
  },
});

export default reportSlice.reducer;
