// Import the centralized API instance
import { api } from './api';

/**
 * Comments API Service
 * Handles all comment-related API calls with proper error handling and logging
 */
const commentsAPI = {
  /**
   * Get comments for a post
   * @param {string} postId - The ID of the post
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of comments per page (default: 20)
   * @param {string} sortBy - Field to sort by (default: 'createdAt')
   * @param {string} sortOrder - Sort order ('asc' or 'desc', default: 'desc')
   * @returns {Promise<Object>} - Returns { success, comments, pagination, totalComments }
   */
  getComments: async (postId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      console.log(`Fetching comments for post ${postId}...`);
      const response = await api.get(`/comments/post/${postId}`, {
        params: { page, limit, sortBy, sortOrder }
      });
      
      console.log('Comments API response:', {
        postId,
        status: response.status,
        data: response.data
      });
      
      return response.data || { 
        success: false, 
        comments: [], 
        pagination: { 
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        },
        totalComments: 0
      };
    } catch (error) {
      console.error('Error fetching comments:', {
        postId,
        error: error.response?.data || error.message
      });
      throw error;
    }
  },
  
  /**
   * Get a single comment by ID
   * @param {string} commentId - The ID of the comment to fetch
   * @returns {Promise<Object>} - Returns the comment data
   */
  getComment: async (commentId) => {
    try {
      console.log(`Fetching comment ${commentId}...`);
      const response = await api.get(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  },
  
    /**
   * Create a new comment on a post
   * @param {string} postId - The ID of the post to comment on
   * @param {string} content - The comment content
   * @param {string} [parentId] - Optional parent comment ID for nested comments
   * @returns {Promise<Object>} - Returns the created comment data with updated comment count
   */
  createComment: async (postId, content, parentId = null) => {
    try {
      console.log('Creating comment:', { postId, content, parentId });
      
      const payload = { postId, content };
      if (parentId) {
        payload.parentId = parentId;
      }
      
      const response = await api.post('/comments', payload);
      
      console.log('Comment created successfully:', {
        commentId: response.data?.comment?._id,
        postId,
        parentId
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing comment
   * @param {string} commentId - The ID of the comment to update
   * @param {string} content - The updated comment content
   * @returns {Promise<Object>} - Returns the updated comment data
   */
  updateComment: async (commentId, content) => {
    try {
      console.log(`Updating comment ${commentId}...`);
      const response = await api.put(`/comments/${commentId}`, { content });
      
      console.log('Comment updated successfully:', {
        commentId,
        contentLength: content?.length
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },
  
  /**
   * Delete a comment
   * @param {string} commentId - The ID of the comment to delete
   * @returns {Promise<Object>} - Returns success status and message
   */
  deleteComment: async (commentId) => {
    try {
      console.log(`Deleting comment ${commentId}...`);
      const response = await api.delete(`/comments/${commentId}`);
      
      console.log('Comment deleted successfully:', { commentId });
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
  
  /**
   * Vote on a comment (upvote/downvote/remove vote)
   * @param {string} commentId - The ID of the comment to vote on
   * @param {'upvote'|'downvote'|'remove'} voteType - Type of vote
   * @returns {Promise<Object>} - Returns updated vote status and score
   */
  voteComment: async (commentId, voteType) => {
    try {
      console.log(`Processing ${voteType} on comment ${commentId}...`);
      const response = await api.post(`/comments/${commentId}/vote`, { voteType });
      
      console.log('Vote processed successfully:', {
        commentId,
        voteType,
        newScore: response.data?.score
      });
      
      return response.data;
    } catch (error) {
      console.error('Error voting on comment:', error);
      throw error;
    }
  },
  
  /**
   * Get the current user's vote status on a comment
   * @param {string} commentId - The ID of the comment
   * @returns {Promise<Object>} - Returns the user's vote status and current score
   */
  getVoteStatus: async (commentId) => {
    try {
      console.log(`Fetching vote status for comment ${commentId}...`);
      const response = await api.get(`/comments/${commentId}/vote`);
      
      console.log('Vote status retrieved:', {
        commentId,
        currentVote: response.data?.userVote,
        score: response.data?.score
      });
      
      return response.data || { userVote: null, score: 0 };
    } catch (error) {
      console.error('Error getting vote status:', error);
      throw error;
    }
  },
};

// Legacy functions for backward compatibility
const fetchComments = async (postId) => {
  try {
    const result = await commentsAPI.getComments(postId);
    return result.comments || [];
  } catch (error) {
    console.error('Error in fetchComments:', error);
    return [];
  }
};

const postComment = async (postId, userId, content) => {
  try {
    return await commentsAPI.createComment(postId, content);
  } catch (error) {
    console.error('Error in postComment:', error);
    throw error;
  }
};

const upvoteComment = async (commentId, userId) => {
  try {
    return await commentsAPI.voteComment(commentId, 'upvote');
  } catch (error) {
    console.error('Error in upvoteComment:', error);
    throw error;
  }
};

const downvoteComment = async (commentId, userId) => {
  try {
    return await commentsAPI.voteComment(commentId, 'downvote');
  } catch (error) {
    console.error('Error in downvoteComment:', error);
    throw error;
  }
};

// Export all functions
export {
  commentsAPI as default,
  fetchComments,
  postComment,
  upvoteComment,
  downvoteComment
};

// Export individual functions for direct imports
export const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  voteComment,
  getVoteStatus
} = commentsAPI;
