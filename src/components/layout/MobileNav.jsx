import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    FireIcon,
    UserGroupIcon,
    TrophyIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    FireIcon as FireIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    TrophyIcon as TrophyIconSolid,
    SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Trending', href: '/trending', icon: FireIcon, activeIcon: FireIconSolid },
    { name: 'Community', href: '/community', icon: UserGroupIcon, activeIcon: UserGroupIconSolid },
    { name: 'Hall of Fame', href: '/hall-of-fame', icon: TrophyIcon, activeIcon: TrophyIconSolid },
    { name: 'Ask AI', href: '/ask-ai', icon: SparklesIcon, activeIcon: SparklesIconSolid },
];

const MobileNav = () => {
    const location = useLocation();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
            <div className="flex items-center justify-around h-16">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                ? 'text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
