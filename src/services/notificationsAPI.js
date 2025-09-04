// Import the centralized API instance
import { api } from './api';

// This file is now a wrapper around the centralized API instance
// to maintain backward compatibility with existing imports

// Get all notifications for current user
const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Mark a single notification as read
const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export { getNotifications, markAllAsRead, markAsRead };
