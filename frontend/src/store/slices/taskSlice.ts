import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Task, TaskState } from '../../types';
import { AxiosError } from 'axios';



const initialState: TaskState = {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
};

// Consolidated createTask action
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: Partial<Task>, { rejectWithValue }) => {
        try {
            const response = await api.post('/tasks', taskData);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || 'Failed to create task';
            return rejectWithValue(message);
        }
    }
);

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (filters: Record<string, string | undefined> = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/tasks', { params: filters });
            return response.data.tasks;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || 'Failed to fetch tasks';
            return rejectWithValue(message);
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchTaskById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/tasks/${id}`);
            return response.data.task;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || 'Failed to fetch task details';
            return rejectWithValue(message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }: { id: string; data: Partial<Task> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/tasks/${id}`, data);
            return response.data.task;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/tasks/${id}`);
            return id;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },
        updateTaskStatusOptimistic: (state, action: { payload: { id: string; status: Task['status'] } }) => {
            const { id, status } = action.payload;
            const index = state.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                state.tasks[index].status = status;
            }
        },
    },
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
            })
            // Fetch Single Task
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentTask, updateTaskStatusOptimistic } = taskSlice.actions;
export default taskSlice.reducer;
