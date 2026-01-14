import { Link } from 'react-router-dom';

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'like': return '❤️';
    case 'comment': return '💬';
    case 'milestone': return '🎉';
    default: return '🔔';
  }
};

const NotificationItem = ({ notification, onMarkAsRead, onClose }) => (
  <Link
    to={notification.post?._id ? `/posts/${notification.post._id}` : (notification.post ? `/posts/${notification.post}` : '#')}
    onClick={() => {
      if (!notification.read) onMarkAsRead(notification._id);
      onClose();
    }}
    className={`block px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-1">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-gray-800">
          {notification.sender?.name || 'Someone'} {notification.content}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
    </div>
  </Link>
);

export default NotificationItem;
