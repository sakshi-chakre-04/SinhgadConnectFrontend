import React from 'react';
import SearchBar from '../SearchBar';
import NavLinkItem from './NavLinkItem';

const MobileMenu = ({ isOpen, onClose, onCreateClick, navLinks, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-b border-gray-200">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {/* Search Bar */}
        <div className="px-2 py-2">
          <SearchBar className="w-full" />
        </div>

        {/* Navigation Links */}
        {navLinks.map((link) => (
          <NavLinkItem
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            className="w-full justify-start"
            onClick={() => {
              onNavigate();
              onClose();
            }}
          />
        ))}

        {/* Create Post Button */}
        <button
          onClick={onCreateClick}
          className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          + Create Post
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
