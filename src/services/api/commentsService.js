import { api } from './api';

export const commentsAPI = {
  getComments: async (postId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
    const { data } = await api.get(`/comments/post/${postId}`, {
      params: { page, limit, sortBy, sortOrder }
    });
    return data;
  },
  
  getComment: async (commentId) => {
    const { data } = await api.get(`/comments/${commentId}`);
    return data;
  },
  
  createComment: async (postId, content, parentId = null) => {
    const payload = { postId, content };
    if (parentId) payload.parentId = parentId;
    
    const { data } = await api.post('/comments', payload);
    return data;
  },
  
  updateComment: async (commentId, content) => {
    const { data } = await api.put(`/comments/${commentId}`, { content });
    return data;
  },
  
  deleteComment: async (commentId) => {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
  },
  
  voteComment: async (commentId, voteType) => {
    const { data } = await api.post(`/comments/${commentId}/vote`, { voteType });
    return data;
  },
  
  getVoteStatus: async (commentId) => {
    const { data } = await api.get(`/comments/${commentId}/vote`);
    return data || { userVote: null, score: 0 };
  },
};

export default commentsAPI;
