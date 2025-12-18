import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    budget: number;
    spent: number;
    manager: { id: string; name: string };
    priority?: string;
    tasks?: { status: string }[];
    team?: {
        members: {
            user: {
                id: string;
                name: string;
                avatar?: string;
            }
        }[];
    };
    _count?: { tasks: number };
}

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
};

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/projects');
            return response.data.projects;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/projects', projectData);
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/projects/${id}`);
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/projects/${id}`, data);
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/projects/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            // Fetch Single Project
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Project
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            // Delete Project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter((p) => p.id !== action.payload);
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
