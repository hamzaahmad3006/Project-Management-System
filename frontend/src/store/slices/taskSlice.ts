import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Task, TaskState, Subtask } from 'types';
import { AxiosError } from 'axios';

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

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

// Add Subtask
export const addSubtask = createAsyncThunk(
  'tasks/addSubtask',
  async ({ taskId, title }: { taskId: string; title: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, { title });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add subtask'
      );
    }
  }
);

export const toggleSubtask = createAsyncThunk(
  'tasks/toggleSubtask',
  async ({ subtaskId }: { subtaskId: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Subtask>(`/tasks/subtasks/${subtaskId}`);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to toggle subtask'
      );
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: { payload: Partial<Task> | null }) => {
      state.currentTask = action.payload as Task | null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    updateTaskStatusOptimistic: (
      state,
      action: { payload: { id: string; status: Task['status'] } }
    ) => {
      const { id, status } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tasks[index].status = status;
      }
    },
    receiveSubtask: (state, action: { payload: Subtask }) => {
      const subtask = action.payload;
      // Update currentTask if it matches
      if (state.currentTask && state.currentTask.id === subtask.taskId) {
        if (!state.currentTask.subtasks) state.currentTask.subtasks = [];
        const exists = state.currentTask.subtasks.some((s) => s.id === subtask.id);
        if (!exists) {
          state.currentTask.subtasks.push(subtask);
        }
      }
      // Update task in list if it exists
      const taskInList = state.tasks.find((t) => t.id === subtask.taskId);
      if (taskInList) {
        if (!taskInList.subtasks) taskInList.subtasks = [];
        const exists = taskInList.subtasks.some((s) => s.id === subtask.id);
        if (!exists) {
          taskInList.subtasks.push(subtask);
        }
      }
    },
    updateSubtaskStatus: (state, action: { payload: Subtask }) => {
      const subtask = action.payload;
      // Update currentTask if it matches
      if (state.currentTask && state.currentTask.id === subtask.taskId) {
        const existing = state.currentTask.subtasks?.find((s) => s.id === subtask.id);
        if (existing) {
          existing.completed = subtask.completed;
        }
      }
      // Update task in list if it exists
      const taskInList = state.tasks.find((t) => t.id === subtask.taskId);
      if (taskInList) {
        const existing = taskInList.subtasks?.find((s) => s.id === subtask.id);
        if (existing) {
          existing.completed = subtask.completed;
        }
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
      })
      // Add Subtask
      .addCase(addSubtask.fulfilled, (state, action) => {
        if (state.currentTask && state.currentTask.id === action.payload.taskId) {
          if (!state.currentTask.subtasks) state.currentTask.subtasks = [];
          state.currentTask.subtasks.push(action.payload);
        }
        const taskInList = state.tasks.find((t) => t.id === action.payload.taskId);
        if (taskInList) {
          if (!taskInList.subtasks) taskInList.subtasks = [];
          taskInList.subtasks.push(action.payload);
        }
      })
      // Toggle Subtask
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        if (state.currentTask) {
          const subtask = state.currentTask.subtasks?.find((s) => s.id === action.payload.id);
          if (subtask) {
            subtask.completed = action.payload.completed;
          }
        }
        const taskInList = state.tasks.find((t) => t.id === action.payload.taskId);
        if (taskInList) {
          const subtask = taskInList.subtasks?.find((s) => s.id === action.payload.id);
          if (subtask) {
            subtask.completed = action.payload.completed;
          }
        }
      });
  },
});

export const {
  clearCurrentTask,
  updateTaskStatusOptimistic,
  setSelectedTask,
  receiveSubtask,
  updateSubtaskStatus,
} = taskSlice.actions;
export default taskSlice.reducer;
