import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import projectReducer from './slices/projectSlice';
import calendarReducer from './slices/calendarSlice';
import teamReducer from './slices/teamSlice';
import budgetReducer from './slices/budgetSlice';
import reportReducer from './slices/reportSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        projects: projectReducer,
        calendar: calendarReducer,
        team: teamReducer,
        budget: budgetReducer,
        reports: reportReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
