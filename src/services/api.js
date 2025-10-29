import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Store reference to the Redux store
let store;

export const injectStore = (_store) => {
  store = _store;
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login/register requests
    if (config.url.includes('/auth/')) {
      return config;
    }
    
    // Get token from Redux store if available
    const token = store?.getState()?.auth?.token || 
                 localStorage.getItem('token') || 
                 sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`[API] No token found for request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error details
    console.error('[API] Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.error('[API] Authentication error:', error.response?.data?.message || 'Unauthorized');
      
      // Only handle if this isn't a retry and not already a login request
      if (!originalRequest._retry && !originalRequest.url.includes('/auth/')) {
        // Mark this request as retried to prevent infinite loops
        originalRequest._retry = true;
        
        // Get the current token from storage
        const token = updateToken();
        
        // If we have a token but still got 401, it might be expired
        if (token) {
          try {
            // Try to refresh the token if your backend supports it
            // const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
            // if (refreshToken) {
            //   const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
            //   const { token: newToken } = response.data;
            //   
            //   // Update the token in storage
            //   if (localStorage.getItem('token')) {
            //     localStorage.setItem('token', newToken);
            //   } else {
            //     sessionStorage.setItem('token', newToken);
            //   }
            //   
            //   // Update the current token
            //   updateToken();
            //   
            //   // Update the Authorization header
            //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //   
            //   // Retry the original request
            //   return api(originalRequest);
            // }
            
            // If token refresh isn't implemented or fails, clear auth and redirect to login
            console.log('[API] Token might be invalid or expired, clearing auth data...');
            
            // Only clear and redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              // Clear auth data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('user');
              
              // Update current token
              updateToken();
              
              // Redirect to login page with a return URL
              window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
            }
          } catch (error) {
            console.error('[API] Error during token refresh:', error);
            // Clear auth data on refresh error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
        } else {
          // No token found, redirect to login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleResponse = (response) => {
  return response.data;
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    try {
      // Ensure email is trimmed and lowercase
      const loginData = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      };
      
      console.log('Sending login request with credentials:', {
        ...loginData,
        password: '***' // Don't log actual password
      });
      
      const response = await api.post('/auth/login', loginData);
      
      console.log('Login response received:', {
        status: response.status,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      });
      
      const { data } = response;
      
      if (!data?.token || !data?.user) {
        console.error('Invalid response format from server:', data);
        throw new Error('Invalid response format from server');
      }
      
      return data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Return more specific error messages
      if (error.response?.status === 400) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },
  
  // Get current user (requires token)
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return handleResponse(response);
  },
};

// Posts API calls
export const postsAPI = {
  // Get all posts
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return handleResponse(response);
  },
  
  // Get posts by department
  getDepartmentPosts: async (department, params = {}) => {
    const response = await api.get('/posts', { 
      params: { ...params, department } 
    });
    return handleResponse(response);
  },
  
  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return handleResponse(response);
  },
  
  // Get single post
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return handleResponse(response);
  },
  
  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return handleResponse(response);
  },
  
  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return handleResponse(response);
  },
  
  // Vote on post
  votePost: async (postId, voteType) => {
    const response = await api.post(`/posts/${postId}/vote`, { voteType });
    return handleResponse(response);
  },
};

// Users API calls
export const usersAPI = {
  // Update user profile
  updateUserProfile: async (userData, token) => {
    try {
      // Ensure we only send the fields that the backend expects
      const { name, department, year, bio } = userData;
      const payload = { name, department, year, bio };
      
      const response = await api.patch('/auth/me', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return handleResponse(response);
  },
  
  // Update user settings
  updateUserSettings: async (settings) => {
    const response = await api.put('/users/settings', settings);
    return handleResponse(response);
  }
};

// Comments API calls
export const commentsAPI = {
  // Get comments for a post
  getComments: async (postId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
    const response = await api.get(`/comments/post/${postId}`, {
      params: { page, limit, sortBy, sortOrder }
    });
    return handleResponse(response);
  },
  
  // Get single comment
  getComment: async (commentId) => {
    const response = await api.get(`/comments/${commentId}`);
    return handleResponse(response);
  },
  
  // Create new comment
  createComment: async (postId, content) => {
    const response = await api.post('/comments', { postId, content });
    return handleResponse(response);
  },
  
  // Update comment
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return handleResponse(response);
  },
  
  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return handleResponse(response);
  },
  
  // Vote on comment (upvote, downvote, or remove vote)
  voteComment: async (commentId, voteType) => {
    const response = await api.post(`/comments/${commentId}/vote`, { voteType });
    return handleResponse(response);
  },
  
  // Get user's vote status for a comment
  getVoteStatus: async (commentId) => {
    const response = await api.get(`/comments/${commentId}/vote`);
    return handleResponse(response);
  },
};

// Export the configured axios instance for direct use
export { api };