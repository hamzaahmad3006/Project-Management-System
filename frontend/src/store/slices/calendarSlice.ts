import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { CalendarEvent, CalendarState } from '../../types';

const initialState: CalendarState = {
    events: [],
    loading: false,
    error: null,
};

export const fetchEvents = createAsyncThunk(
    'calendar/fetchEvents',
    async ({ start, end }: { start?: string; end?: string }, { rejectWithValue }) => {
        try {
            const response = await api.get<{ events: CalendarEvent[] }>('/calendar', { params: { start, end } });
            return response.data.events;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch events');
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
                state.error = null;
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
