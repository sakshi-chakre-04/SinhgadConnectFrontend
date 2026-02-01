import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const ProfileDropdown = ({ isOpen, user, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div
      className="origin-top-right absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 bg-white/95 backdrop-blur-xl border border-violet-100 animate-in fade-in slide-in-from-top-2 duration-200"
      role="menu"
      aria-orientation="vertical"
    >
      {/* User Info Header */}
      <div className="p-4 bg-violet-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-white/80 truncate">{user?.email || ''}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-all duration-200 group"
          role="menuitem"
          onClick={onClose}
        >
          <UserCircleIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
          <span className="font-medium">Your Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-all duration-200 group"
          role="menuitem"
          onClick={onClose}
        >
          <Cog6ToothIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
          <span className="font-medium">Settings</span>
        </NavLink>

        {/* Divider */}
        <div className="my-2 border-t border-gray-100" />

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          role="menuitem"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
