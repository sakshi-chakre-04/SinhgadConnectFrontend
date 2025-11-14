import { api } from './api';

export const authAPI = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  login: async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      });
      
      if (!data?.token || !data?.user) {
        throw new Error('Invalid response format from server');
      }
      
      return data;
    } catch (error) {
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
  
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export default authAPI;
