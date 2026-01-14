import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api/notificationsService';  // ✅ Updated
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(notification.read);

  const handleClick = async () => {
    if (!isRead) {
      await onMarkAsRead(notification._id);
      setIsRead(true);
    }

    // Navigate to the relevant post/comment
    if (notification.post) {
      navigate(`/posts/${notification.post._id}`);
    }
  };

  const getNotificationMessage = () => {
    const sender = notification.sender?.name || 'Someone';
    const postTitle = notification.post?.title ? `"${notification.post.title}"` : '';

    switch (notification.type) {
      case 'like':
        return `${sender} liked your post ${postTitle}`;
      case 'comment':
        return `${sender} commented on your post ${postTitle}`;
      case 'reply':
        return `${sender} replied to your comment`;
      case 'mention':
        return `${sender} mentioned you in a comment`;
      default:
        return notification.content || 'New notification';
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return '❤️';
      case 'comment':
      case 'reply':
      case 'mention':
        return '💬';
      default:
        return '🔔';
    }
  };

  return (
    <div
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!isRead ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="text-xl mr-3">{getNotificationIcon()}</div>
        <div className="flex-1">
          <p className="text-gray-800">{getNotificationMessage()}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {!isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
        )}
      </div>
    </div>
  );
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getNotifications();  // ✅ Updated
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);  // ✅ Updated
      // Update local state to reflect the read status
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();  // ✅ Updated
      // Update local state to reflect all notifications as read
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">You're all caught up! 🎉</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Check out the latest posts to get notified when someone replies to your questions!
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explore Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
