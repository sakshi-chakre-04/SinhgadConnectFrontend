import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../hooks/useModal';
import { logout, selectUser } from '../../features/auth/authSlice';
import {
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    BellIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

const MobileTopNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const menuItems = [
        { name: 'Profile', href: '/profile', icon: UserIcon },
        { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    const handleCreatePost = () => {
        openModal();
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <>
            {/* Static Rainbow Gradient */}
            <style>{`
                .rainbow-text {
                    background: linear-gradient(
                        90deg,
                        #9185D6,
                        #D094B6,
                        #F8BC26
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .rainbow-bg {
                    background: linear-gradient(
                        135deg,
                        #9185D6,
                        #D094B6,
                        #F8BC26
                    );
                }
            `}</style>
            {/* Top Navigation Bar - Mobile Only */}
            <nav className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-pt">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Left Side: Hamburger + Logo */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Open Menu"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rainbow-bg rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-lg rainbow-text">
                                SinhgadConnect
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Notifications + Create Post */}
                    <div className="flex items-center gap-2">
                        <NavLink
                            to="/notifications"
                            className={({ isActive }) =>
                                `w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                            aria-label="Notifications"
                        >
                            {({ isActive }) => (
                                isActive ? <BellIconSolid className="w-6 h-6" /> : <BellIcon className="w-6 h-6" />
                            )}
                        </NavLink>
                        <button
                            onClick={handleCreatePost}
                            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Create Post"
                        >
                            <PlusIcon className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Slide-in Menu Drawer */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-fadeIn"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Drawer */}
                    <div className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl animate-slideInLeft">
                        {/* Menu Header with User Info */}
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">{user?.name || 'User'}</h2>
                                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white/50 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <nav className="p-4 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={handleMenuItemClick}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </NavLink>
                                );
                            })}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </nav>
                    </div>
                </>
            )}
        </>
    );
};

export default MobileTopNav;
