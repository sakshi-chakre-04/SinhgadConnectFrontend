const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  // Get current user (requires token)
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  },
};

// Posts API calls
export const postsAPI = {
  // Get all posts
  getAllPosts: async () => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return handleResponse(response);
  },

  // Create new post
  createPost: async (postData, token) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    return handleResponse(response);
  },
};

// Comments API calls
export const commentsAPI = {
  // Get comments for a post
  getComments: async (postId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return handleResponse(response);
  },

  // Get single comment
  getComment: async (commentId) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`);
    return handleResponse(response);
  },

  // Create new comment
  createComment: async (postId, content, token) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, content }),
    });
    
    return handleResponse(response);
  },

  // Update comment
  updateComment: async (commentId, content, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    return handleResponse(response);
  },

  // Delete comment
  deleteComment: async (commentId, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  // Vote on comment (upvote, downvote, or remove vote)
  voteComment: async (commentId, voteType, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/vote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voteType }), // 'upvote', 'downvote', or 'remove'
    });
    
    return handleResponse(response);
  },

  // Get user's vote status for a comment
  getVoteStatus: async (commentId, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/vote-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};