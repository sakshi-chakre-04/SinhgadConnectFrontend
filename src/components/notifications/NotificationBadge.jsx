import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api/notificationsService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import NotificationDropdown from './NotificationDropdown';
import { useSocket } from '../../context/SocketContext';

const NotificationBadge = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const socket = useSocket();

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const displayedNotifications = allNotifications.slice(0, 5);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification) => {
        console.log('🔔 Real-time notification received:', notification);
        setAllNotifications(prev => [notification, ...prev]);
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications();
      const data = Array.isArray(response) ? response : (response.notifications || []);
      setAllNotifications(data);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationsRead = async (notificationIds, markAsRead = true) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    setAllNotifications(prev =>
      prev.map(n => ids.includes(n._id) ? { ...n, read: markAsRead } : n)
    );
    try {
      await Promise.all(ids.map(id => notificationsAPI.markAsRead(id)));
    } catch (error) {
      console.error('Error updating notifications:', error);
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = allNotifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length > 0) {
      await updateNotificationsRead(unreadIds, true);
    }
  };

  if (loading) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          notifications={displayedNotifications}
          unreadCount={unreadCount}
          onMarkAsRead={updateNotificationsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setShowDropdown(false)}
        />
      )}

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
};

export default NotificationBadge;
