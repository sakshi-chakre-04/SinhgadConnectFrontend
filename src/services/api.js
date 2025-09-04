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
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error('Authentication error:', error.response?.data?.message || 'Unauthorized');
      // You might want to clear auth state and redirect to login here
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
      const response = await api.post('/auth/login', credentials);
      const { data } = response;
      
      if (!data.token || !data.user) {
        throw new Error('Invalid response format from server');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || 'Login failed';
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