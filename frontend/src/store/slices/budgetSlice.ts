import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { BudgetState, BudgetOverview, BudgetProject, UpdateBudgetData } from '../../types';

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
            const response = await api.get<{ overview: BudgetOverview; projects: BudgetProject[] }>('/budget/overview');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch budget');
        }
    }
);

export const updateProjectBudget = createAsyncThunk(
    'budget/updateProjectBudget',
    async ({ projectId, data }: { projectId: string; data: UpdateBudgetData }, { rejectWithValue }) => {
        try {
            const response = await api.put<{ project: BudgetProject }>(`/budget/${projectId}`, data);
            return response.data.project;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update budget');
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
                state.error = null;
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
            .addCase(updateProjectBudget.fulfilled, (state, action: PayloadAction<BudgetProject>) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = { ...state.projects[index], ...action.payload };
                }
            });
    },
});

export default budgetSlice.reducer;
