import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface BudgetState {
    overview: {
        totalBudget: number;
        totalSpent: number;
        remaining: number;
    } | null;
    projects: any[];
    loading: boolean;
    error: string | null;
}

const initialState: BudgetState = {
    overview: null,
    projects: [],
    loading: false,
    error: null,
};

export const fetchBudgetOverview = createAsyncThunk(
    'budget/fetchOverview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/budget/overview');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch budget');
        }
    }
);

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgetOverview.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgetOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload.overview;
                state.projects = action.payload.projects;
            })
            .addCase(fetchBudgetOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default budgetSlice.reducer;
