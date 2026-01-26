import { Link } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'like': return '❤️';
    case 'comment': return '💬';
    case 'reply': return '↩️';
    case 'mention': return '@';
    default: return '🔔';
  }
};

const NotificationDropdown = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose
}) => (
  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold bg-violet-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMarkAllAsRead();
        }}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-sm border ${unreadCount > 0
          ? 'text-violet-600 bg-white hover:bg-violet-100 border-violet-200'
          : 'text-gray-400 bg-gray-50 border-gray-200 cursor-default'
          }`}
        disabled={unreadCount === 0}
      >
        <CheckIcon className="w-3.5 h-3.5" />
        Mark all read
      </button>
    </div>

    {/* Notification List */}
    <div className="max-h-80 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <Link
            key={notification._id}
            to={notification.post?._id ? `/posts/${notification.post._id}` : (notification.post ? `/posts/${notification.post}` : '#')}
            onClick={() => {
              if (!notification.read) onMarkAsRead(notification._id);
              onClose();
            }}
            className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${!notification.read ? 'bg-violet-50/50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-lg mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm text-gray-800 line-clamp-2 ${!notification.read ? 'font-semibold' : ''}`}>
                  <span className="font-semibold text-gray-900">{notification.sender?.name || 'Someone'}</span>{' '}
                  {notification.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkAsRead(notification._id);
                    }}
                    className="p-1 text-gray-400 hover:text-violet-600 hover:bg-violet-100 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-sm font-medium text-gray-700">All caught up!</p>
          <p className="text-xs text-gray-400 mt-1">No unread notifications</p>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
      <Link
        to="/notifications"
        className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
        onClick={onClose}
      >
        View all notifications →
      </Link>
    </div>
  </div>
);

export default NotificationDropdown;
