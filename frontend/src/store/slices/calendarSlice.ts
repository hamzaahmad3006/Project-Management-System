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
    async ({ start, end, projectId }: { start?: string; end?: string; projectId?: string }, { rejectWithValue }) => {
        try {
            const response = await api.get<{ events: CalendarEvent[] }>('/calendar', { params: { start, end, projectId } });
            return response.data.events;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch events');
        }
    }
);

export const createCalendarEvent = createAsyncThunk(
    'calendar/createEvent',
    async (eventData: any, { rejectWithValue }) => {
        try {
            const response = await api.post<{ event: CalendarEvent }>('/calendar', eventData);
            return response.data.event;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create event');
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
            })
            .addCase(createCalendarEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            });
    },
});

export default calendarSlice.reducer;
