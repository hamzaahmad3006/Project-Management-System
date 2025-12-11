import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    type: 'MEETING' | 'DEADLINE' | 'EVENT';
    startTime: string;
    endTime: string;
    projectId?: string;
    attendees: any[];
}

interface CalendarState {
    events: CalendarEvent[];
    loading: boolean;
    error: string | null;
}

const initialState: CalendarState = {
    events: [],
    loading: false,
    error: null,
};

export const fetchEvents = createAsyncThunk(
    'calendar/fetchEvents',
    async ({ start, end }: { start?: string; end?: string }, { rejectWithValue }) => {
        try {
            const response = await api.get('/calendar', { params: { start, end } });
            return response.data.events;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
        }
    }
);

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default calendarSlice.reducer;
