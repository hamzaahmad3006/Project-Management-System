import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    _count: { assignedTasks: number };
}

export interface Team {
    id: string;
    name: string;
}

export interface TeamState {
    members: TeamMember[];
    allTeams: Team[];
    loading: boolean;
    error: string | null;
}

const initialState: TeamState = {
    members: [],
    allTeams: [],
    loading: false,
    error: null,
};

export const fetchTeamMembers = createAsyncThunk(
    'team/fetchMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/teams');
            return response.data.users;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
        }
    }
);

export const getTeams = createAsyncThunk(
    'team/getTeam',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/teams');
            return response.data.users;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members')
        }
    }
)

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
    },
});

export default teamSlice.reducer;
