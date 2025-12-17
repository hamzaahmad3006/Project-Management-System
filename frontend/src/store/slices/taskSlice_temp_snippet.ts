import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/axios";

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (filters: any = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/tasks', { params: filters });
            return response.data.tasks;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);
