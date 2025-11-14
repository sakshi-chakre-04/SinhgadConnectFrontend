import { api } from './api';

export const notificationsAPI = {
  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await api.put(`/notifications/${notificationId}/read`);
    return data;
  }
};

export default notificationsAPI;
