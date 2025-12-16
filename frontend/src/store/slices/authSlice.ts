import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'MEMBER' | 'MANAGER';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    allUsers: User[];
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    allUsers: [],
};

export const loginwithgoogle = createAsyncThunk(
    '/auth/google',
    async (googleData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/google', googleData)
            localStorage.setItem('token', response.data.token)
            return response.data
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed')
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);



export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'auth/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/all-users'); // backend endpoint to get all users
            return response.data.users; // assume backend returns { users: [...] }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
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
