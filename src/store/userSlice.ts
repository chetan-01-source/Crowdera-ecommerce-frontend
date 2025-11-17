import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getUserById, deleteUserById } from '../api/userApi';
import type { User, GetUserResponse, DeleteUserResponse } from '../api/userApi';

// User state interface
export interface UserState {
  selectedUser: User | null;
  loading: boolean;
  deleting: boolean;
  error: string | null;
  deleteSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  selectedUser: null,
  loading: false,
  deleting: false,
  error: null,
  deleteSuccess: false,
};

// Async thunk for getting user by ID
export const fetchUserById = createAsyncThunk<
  User,
  string,
  {
    rejectValue: string;
  }
>(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: GetUserResponse = await getUserById(userId);

      return response.data; // Changed from response.user to response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

// Async thunk for deleting user by ID
export const deleteUser = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>(
  'user/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: DeleteUserResponse = await deleteUserById(userId);
    
      return response.message;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.error = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.selectedUser = null;
        state.error = action.payload || 'Failed to fetch user';
      })
      
      // Handle deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleting = false;
        state.selectedUser = null; // Clear selected user after successful deletion
        state.error = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete user';
        state.deleteSuccess = false;
      });
  },
});

export const { clearUserError, clearSelectedUser, clearDeleteSuccess } = userSlice.actions;
export default userSlice.reducer;