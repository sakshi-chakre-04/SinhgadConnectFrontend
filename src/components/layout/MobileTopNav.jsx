import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import {
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    UserGroupIcon,
    TrophyIcon,
    BookOpenIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const MobileTopNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openModal } = useModal();

    const menuItems = [
        { name: 'Community', href: '/community', icon: UserGroupIcon },
        { name: 'Hall of Fame', href: '/hall-of-fame', icon: TrophyIcon },
        { name: 'Resources', href: '/resources', icon: BookOpenIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    const handleCreatePost = () => {
        openModal();
    };

    return (
        <>
            {/* Top Navigation Bar - Mobile Only */}
            <nav className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-pt">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Open Menu"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    {/* App Logo/Title */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-gray-900">SinhgadConnect</span>
                    </div>

                    {/* Create Post Button */}
                    <button
                        onClick={handleCreatePost}
                        className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
                        aria-label="Create Post"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
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
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">S</span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">Sinhgad</h2>
                                    <p className="text-xs text-gray-500">Connect</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
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
                        </nav>
                    </div>
                </>
            )}

            {/* Add custom animations */}
            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                .animate-slideInLeft {
                    animation: slideInLeft 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default MobileTopNav;
