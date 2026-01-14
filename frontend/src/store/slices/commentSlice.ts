import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../api/axios';
import { Comment, CommentState } from 'types';

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ comments: Comment[] }>(`/comments/task/${taskId}`);
      return response.data.comments;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch comments'
      );
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (
    { taskId, content, attachments }: { taskId: string; content: string; attachments?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Comment>(`/comments/task/${taskId}`, {
        content,
        attachments,
      });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add comment'
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return commentId;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete comment'
      );
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
    receiveComment: (state, action: PayloadAction<Comment>) => {
      const exists = state.comments.some((c) => c.id === action.payload.id);
      if (!exists) {
        state.comments.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.comments.unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<string>) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearComments, receiveComment } = commentSlice.actions;
export default commentSlice.reducer;
