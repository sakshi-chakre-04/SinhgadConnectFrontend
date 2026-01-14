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
      className={`p-5 transition-all duration-300 cursor-pointer border-l-4 hover:pl-6 ${!isRead
          ? 'bg-indigo-50/30 border-indigo-500'
          : 'bg-transparent border-transparent hover:bg-gray-50/50'
        }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1 filter drop-shadow-sm">{getNotificationIcon()}</div>
        <div className="flex-1">
          <p className={`text-gray-900 leading-snug ${!isRead ? 'font-semibold' : 'font-medium'}`}>
            {getNotificationMessage()}
          </p>
          <p className="text-sm text-gray-500 mt-1.5 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {!isRead && (
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 animate-pulse shadow-lg shadow-indigo-500/40"></div>
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
      <div className="max-w-4xl mx-auto pt-6">
        <div className="glass-panel p-8 rounded-3xl animate-pulse">
          <div className="h-8 bg-gray-200/50 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto pt-6">
        <div className="glass-panel p-8 rounded-3xl text-center text-red-500">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-20">
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="text-xl">🔔</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-2 ml-14">
              You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100/50">
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-12 h-12 text-indigo-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All caught up! 🎉</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">
              Check back later for updates on your posts and discussions.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              Explore Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
