import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { Project, ProjectState, CreateProjectData, UpdateProjectData } from '../../types';

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    selectedProjectId: 'all',
    loading: false,
    error: null,
};

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ projects: Project[] }>('/projects');
            return response.data.projects;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch projects');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: CreateProjectData, { rejectWithValue }) => {
        try {
            const response = await api.post<{ project: Project }>('/projects', projectData);
            return response.data.project;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create project');
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get<{ project: Project }>(`/projects/${id}`);
            return response.data.project;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, data }: { id: string; data: UpdateProjectData }, { rejectWithValue }) => {
        try {
            const response = await api.put<{ project: Project }>(`/projects/${id}`, data);
            return response.data.project;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/projects/${id}`);
            return id;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete project');
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
        setCurrentProject: (state, action: PayloadAction<Project | null>) => {
            state.currentProject = action.payload;
        },
        setSelectedProjectId: (state, action: PayloadAction<string>) => {
            state.selectedProjectId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.projects.unshift(action.payload);
            })
            // Fetch Single Project
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Project
            .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
                const index = state.projects.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            // Delete Project
            .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
                state.projects = state.projects.filter((p) => p.id !== action.payload);
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            });
    },
});

export const { clearCurrentProject, setCurrentProject, setSelectedProjectId } = projectSlice.actions;
export default projectSlice.reducer;
