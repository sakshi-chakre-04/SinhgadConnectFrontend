import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClose 
}) => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
    <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
      {unreadCount > 0 && (
        <button 
          onClick={onMarkAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      )}
    </div>
    
    <div className="max-h-96 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onClose={onClose}
          />
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No notifications yet
        </div>
      )}
    </div>
    
    <div className="p-2 border-t border-gray-200 bg-gray-50 text-center">
      <Link 
        to="/notifications" 
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
        onClick={onClose}
      >
        View all notifications
      </Link>
    </div>
  </div>
);

export default NotificationDropdown;
