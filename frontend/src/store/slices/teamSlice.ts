import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { TeamState, TeamFile, DashboardTask } from 'types';

type RecentActivity = DashboardTask;

const initialState: TeamState = {
  members: [],
  allTeams: [],
  stats: null,
  files: [],
  loading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/teams');
      return response.data.users;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const getTeams = createAsyncThunk('team/getTeam', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/teams');
    return response.data.users;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
  }
});

export const fetchTeamMembersById = createAsyncThunk(
  'team/fetchMembersById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/teams/getTeamMembers?teamId=${teamId}`);
      return response.data.users;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

export const fetchTeamStats = createAsyncThunk(
  'team/fetchStats',
  async ({ teamId, year }: { teamId: string; year?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/teams/${teamId}/stats`, { params: { year } });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team stats');
    }
  }
);

export const fetchTeamFiles = createAsyncThunk(
  'team/fetchFiles',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/teams/${teamId}/files`);
      return response.data.files;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team files');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //get teamss
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.allTeams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch stats
      .addCase(fetchTeamStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTeamStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch members by id
      .addCase(fetchTeamMembersById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamMembersById.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch files
      .addCase(fetchTeamFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchTeamFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teamSlice.reducer;
