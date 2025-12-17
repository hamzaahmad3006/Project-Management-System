import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    projectId: string;
    assignedTo?: { id: string; name: string; avatar?: string };
    project?: { id: string; name: string };
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

// Consolidated createTask action
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/tasks', taskData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

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

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/tasks/${id}`, data);
            return response.data.task;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/tasks/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            });
    },
});

export default taskSlice.reducer;
