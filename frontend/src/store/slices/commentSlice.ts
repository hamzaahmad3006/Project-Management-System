import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Comment } from '../../types';

interface CommentState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null,
};

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/comments/task/${taskId}`);
            return response.data.comments;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ taskId, content }: { taskId: string; content: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/comments/task/${taskId}`, { content });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/comments/${commentId}`);
            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload); // Add new comment to top
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c.id !== action.payload);
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
