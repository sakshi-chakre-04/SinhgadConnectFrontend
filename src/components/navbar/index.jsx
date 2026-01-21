import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../hooks/useModal';
import { logout, selectUser } from '../../features/auth/authSlice';
import Avatar from 'react-avatar';
import NotificationBadge from '../notifications/NotificationBadge';
import SearchBar from '../SearchBar';
import NavLinkItem from './NavLinkItem';
import ProfileDropdown from './ProfileDropdown';
import NavIcon from './NavIcon';
import MobileMenu from './MobileMenu';
import { NAV_LINKS } from './constants';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Add padding to body to account for fixed navbar
  useEffect(() => {
    document.body.style.paddingTop = '4.5rem';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateClick = () => {
    setIsMobileMenuOpen(false);
    openModal('Create Post');
  };

  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-4 right-4 lg:left-4 lg:right-4 h-16 glass-panel rounded-2xl z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="flex-shrink-0 font-bold text-xl lg:hidden" style={{
        background: 'linear-gradient(90deg, #9185D6, #D094B6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        SinhgadConnect
      </div>

      {/* Desktop Navigation - Hide on LG screens since Sidebar handles nav */}
      <div className="hidden md:flex lg:hidden items-center space-x-1">
        {NAV_LINKS.map((link) => (
          <NavLinkItem
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            onClick={closeMenus}
          />
        ))}
      </div>

      {/* Right Section - Auto margin on LG to push to right if needed */}
      <div className="flex items-center space-x-4 lg:ml-auto">
        <button
          onClick={() => openModal('Create Post')}
          className="hidden sm:inline-flex lg:hidden items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <NavIcon type="plus" />
          <span className="ml-2">Create Post</span>
        </button>

        <SearchBar />
        <NotificationBadge />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {user?.avatar ? (
            <Avatar
              name={user.name}
              src={user.avatar}
              size="32"
              round
              className="cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
          ) : (
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Menu
            </button>
          )}
          <ProfileDropdown
            isOpen={isProfileOpen}
            user={user}
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onCreateClick={handleCreateClick}
        navLinks={NAV_LINKS}
        onNavigate={closeMenus}
      />
    </nav>
  );
};

export default Navbar;
