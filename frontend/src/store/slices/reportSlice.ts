import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface ReportState {
    productivity: any[];
    performance: any | null;
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
        } catch (error: any) {
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
        } catch (error: any) {
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
