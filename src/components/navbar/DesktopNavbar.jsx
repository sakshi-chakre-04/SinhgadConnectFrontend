import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';
import Avatar from 'react-avatar';
import { logout, selectUser } from '../../features/auth/authSlice';
import SearchBar from '../SearchBar';
import NotificationBadge from '../notifications/NotificationBadge';
import ProfileDropdown from './ProfileDropdown';
import UiverseAskAI from './UiverseAskAI';

const DesktopNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    return (
        <header className="hidden lg:flex fixed top-2 left-4 right-4 z-40 items-center justify-between px-6 py-2 glass-panel rounded-2xl border border-white/60 shadow-lg shadow-indigo-500/5 transition-all duration-300">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-105">
                        <span className="font-bold text-xl tracking-tight">S</span>
                    </div>
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <h1 className="font-bold text-lg text-gray-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Sinhgad</h1>
                    <span className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase mt-0.5">Connect</span>
                </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
                <SearchBar />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-5">
                {/* Ask AI Button */}
                <UiverseAskAI />

                {/* Notifications */}
                <div className="relative">
                    <NotificationBadge />
                </div>

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        {user?.avatar ? (
                            <div className={`p-0.5 rounded-full ${isProfileOpen ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-transparent'}`}>
                                <Avatar
                                    name={user.name}
                                    src={user.avatar}
                                    size="40"
                                    round
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-semibold border border-gray-200">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>

                    <ProfileDropdown
                        isOpen={isProfileOpen}
                        user={user}
                        onClose={() => setIsProfileOpen(false)}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </header>
    );
};

export default DesktopNavbar;
