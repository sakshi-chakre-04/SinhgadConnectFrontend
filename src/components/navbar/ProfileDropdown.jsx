import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, user, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical">
      <div className="py-1" role="none">
        <div className="px-4 py-2 text-sm text-gray-700 border-b">
          <div className="font-medium">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
        </div>
        <NavLink 
          to="/profile" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          onClick={onClose}
        >
          Your Profile
        </NavLink>
        <NavLink 
          to="/settings" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          onClick={onClose}
        >
          Settings
        </NavLink>
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          role="menuitem"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
