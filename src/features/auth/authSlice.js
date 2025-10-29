import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, usersAPI } from '../../services/api';

// Helper function to get initial auth state from storage
const getInitialState = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isLoading: false,
    error: null,
  };
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email: email.trim().toLowerCase() });
      const response = await authAPI.login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      console.log('Login successful:', {
        hasToken: !!response.token,
        user: response.user?.email
      });
      
      return response;
    } catch (error) {
      console.error('Login error in thunk:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
        stack: error.stack
      });
      
      // Return a more specific error message based on the response
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid email or password';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please check your credentials.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await usersAPI.updateUserProfile(userData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },
    setCredentials: (state, action) => {
      const { user, token, rememberMe } = action.payload;
      state.user = user;
      state.token = token;
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // Update storage
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  }
});

// Export actions
export const { logout, setCredentials, clearError, updateUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
