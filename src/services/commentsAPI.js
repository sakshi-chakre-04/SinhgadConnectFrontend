const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
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
  createComment: async (postId, content) => {
    const token = getAuthToken();
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
  updateComment: async (commentId, content) => {
    const token = getAuthToken();
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
  deleteComment: async (commentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  // Vote on comment (upvote, downvote, or remove vote)
  voteComment: async (commentId, voteType) => {
    const token = getAuthToken();
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
  getVoteStatus: async (commentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/vote-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Legacy functions for backward compatibility
export const fetchComments = async (postId) => {
  const result = await commentsAPI.getComments(postId);
  return result.comments;
};

export const postComment = async (postId, userId, content) => {
  const result = await commentsAPI.createComment(postId, content);
  return result.comment;
};

export const upvoteComment = async (commentId, userId) => {
  const result = await commentsAPI.voteComment(commentId, 'upvote');
  return result.comment;
};

export const downvoteComment = async (commentId, userId) => {
  const result = await commentsAPI.voteComment(commentId, 'downvote');
  return result.comment;
};

export default commentsAPI;
