import { api } from './api';

export const postsAPI = {
  getAllPosts: async (params = {}) => {
    const { data } = await api.get('/posts', { params });
    return data;
  },
  
  getDepartmentPosts: async (department, params = {}) => {
    const { data } = await api.get('/posts', { params: { ...params, department } });
    return data;
  },
  
  createPost: async (postData) => {
    const { data } = await api.post('/posts', postData);
    return data;
  },
  
  getPost: async (postId) => {
    const { data } = await api.get(`/posts/${postId}`);
    return data;
  },
  
  updatePost: async (postId, postData) => {
    const { data } = await api.put(`/posts/${postId}`, postData);
    return data;
  },
  
  deletePost: async (postId) => {
    const { data } = await api.delete(`/posts/${postId}`);
    return data;
  },
  
  votePost: async (postId, voteType) => {
    const { data } = await api.post(`/posts/${postId}/vote`, { voteType });
    return data;
  },
};

export default postsAPI;
