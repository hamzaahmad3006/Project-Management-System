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

export const updateProjectBudget = createAsyncThunk(
    'budget/updateProjectBudget',
    async ({ projectId, data }: { projectId: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/budget/${projectId}`, data);
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update budget');
        }
    }
);

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Overview
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
            })
            // Update Project Budget
            .addCase(updateProjectBudget.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = { ...state.projects[index], ...action.payload };
                }
            });
    },
});

export default budgetSlice.reducer;
