import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api/notificationsService';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(notification.read);

  const handleClick = async () => {
    if (!isRead) {
      await onMarkAsRead(notification._id);
      setIsRead(true);
    }
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
        ? 'bg-violet-50/50 border-violet-500'
        : 'bg-transparent border-transparent hover:bg-violet-50/30'
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
            <span className="w-1.5 h-1.5 rounded-full bg-violet-300"></span>
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {!isRead && (
          <div className="w-2.5 h-2.5 bg-violet-500 rounded-full mt-2 animate-pulse shadow-lg shadow-violet-500/40"></div>
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
      const data = await notificationsAPI.getNotifications();
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
      await notificationsAPI.markAsRead(notificationId);
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
      await notificationsAPI.markAllAsRead();
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
      <div
        className="min-h-screen pb-20"
        style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
      >
        <div className="max-w-4xl mx-auto pt-6 px-4">
          <div
            className="p-8 rounded-3xl animate-pulse"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
            }}
          >
            <div className="h-8 bg-violet-100 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-violet-50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen pb-20"
        style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
      >
        <div className="max-w-4xl mx-auto pt-6 px-4">
          <div
            className="p-8 rounded-3xl text-center text-red-500"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.15)'
            }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
    >
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)'
          }}
        >
          {/* Header */}
          <div className="p-6 border-b border-violet-100/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
                  style={{ boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}
                >
                  <BellIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-violet-600 font-medium">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="divide-y divide-violet-100/50">
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
              <div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center"
                style={{ boxShadow: 'inset 0 2px 10px rgba(139, 92, 246, 0.1)' }}
              >
                <BellIcon className="w-12 h-12 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All caught up! 🎉</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">
                Check back later for updates on your posts and discussions.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                }}
              >
                Explore Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
