import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, type User, type GetUsersParams, type PaginationInfo } from '../api/userApi';

interface UserListState {
  users: User[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  totalCount: number;
  hasInitialized: boolean;
}

const initialState: UserListState = {
  users: [],
  loading: false,
  loadingMore: false,
  error: null,
  pagination: null,
  totalCount: 0,
  hasInitialized: false,
};

// Async thunk for fetching initial users
export const fetchUsers = createAsyncThunk(
  'userList/fetchUsers',
  async (params: GetUsersParams = {}, { rejectWithValue }) => {
    try {
      const response = await getAllUsers(params);
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

// Async thunk for loading more users (pagination)
export const loadMoreUsers = createAsyncThunk(
  'userList/loadMoreUsers',
  async (params: GetUsersParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { userList: UserListState };
      
      // Use the nextCursor from current pagination state
      const cursor = state.userList.pagination?.nextCursor;
      
      if (!cursor) {
        throw new Error('No more data available');
      }

      const response = await getAllUsers({
        ...params,
        cursor,
      });
      
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to load more users');
    }
  }
);

// Async thunk for refreshing the user list
export const refreshUsers = createAsyncThunk(
  'userList/refreshUsers',
  async (params: GetUsersParams = {}, { rejectWithValue }) => {
    try {
      const response = await getAllUsers({
        limit: 30,
        sortOrder: 'desc',
        ...params,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || 'Failed to refresh users');
    }
  }
);

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.pagination = null;
      state.totalCount = 0;
      state.hasInitialized = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoadingStates: (state) => {
      state.loading = false;
      state.loadingMore = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.hasInitialized = true;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Load more users cases
      .addCase(loadMoreUsers.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreUsers.fulfilled, (state, action) => {
        state.loadingMore = false;
        // Append new users to existing list
        state.users = [...state.users, ...action.payload.users];
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(loadMoreUsers.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      
      // Refresh users cases
      .addCase(refreshUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(refreshUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsers, clearError, resetLoadingStates } = userListSlice.actions;
export default userListSlice.reducer;