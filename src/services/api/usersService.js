import { api } from './api';

export const usersAPI = {
  updateUserProfile: async (userData) => {
    const { name, department, year, bio } = userData;
    const { data } = await api.patch('/auth/me', { name, department, year, bio });
    return data;
  },
  
  getUserProfile: async (userId) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },
  
  updateUserSettings: async (settings) => {
    const { data } = await api.put('/users/settings', settings);
    return data;
  }
};

export default usersAPI;
