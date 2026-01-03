import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import api from '../../api/axios';
import { User, AuthState, LoginCredentials, RegisterData, GoogleAuthData, AuthResponse } from '../../types';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    allUsers: [],
};

export const loginwithgoogle = createAsyncThunk<AuthResponse, GoogleAuthData>(
    '/auth/google',
    async (googleData, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>('/auth/google', googleData)
            localStorage.setItem('token', response.data.token)
            return response.data
        }
        catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk<AuthResponse, RegisterData>(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>('/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const fetchProfile = createAsyncThunk<User, void>(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<User>('/auth/profile');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const fetchAllUsers = createAsyncThunk<User[], void>(
    'auth/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ users: User[] }>('/auth/all-users');
            return response.data.users;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch users');
        }
    }
);

export const changePassword = createAsyncThunk<void, { currentPassword: string; newPassword: string }>(
    'auth/changePassword',
    async (passwords, { rejectWithValue }) => {
        try {
            await api.put('/auth/change-password', passwords);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //Google Login
            .addCase(loginwithgoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginwithgoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginwithgoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token'); // agar fetch fail ho jaye
                state.error = action.payload as string;
            })



            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
