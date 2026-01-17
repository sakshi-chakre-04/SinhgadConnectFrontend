import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    PlusCircleIcon,
    FireIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    BellIcon as BellIconSolid,
    UserIcon as UserIconSolid,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
    FireIcon as FireIconSolid,
    TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, activeIcon: BellIconSolid },
    { name: 'Trending', href: '/trending', icon: FireIcon, activeIcon: FireIconSolid },
    { name: 'Hall of Fame', href: '/hall-of-fame', icon: TrophyIcon, activeIcon: TrophyIconSolid },
    { name: 'Community', href: '/community', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleLeftRightIconSolid },
    { name: 'Profile', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
];

const Sidebar = ({ onCreatePost }) => {
    const location = useLocation();

    return (
        <nav className="hidden lg:flex flex-col fixed left-4 top-4 bottom-4 w-[240px] glass-panel rounded-3xl p-4 z-30 transition-all duration-300">
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 mb-8">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                    <h1 className="font-bold text-lg text-gray-900">Sinhgad</h1>
                    <span className="text-xs text-primary-500 font-medium">Connect</span>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1 flex-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* Create Post Button */}
            <button
                onClick={() => onCreatePost('Create Post')}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
                <PlusCircleIcon className="w-5 h-5" />
                <span>Create Post</span>
            </button>
        </nav>
    );
};

export default Sidebar;
