import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserGroupIcon,
    SparklesIcon,
    BookOpenIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    SparklesIcon as SparklesIconSolid,
    BookOpenIcon as BookOpenIconSolid,
    TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Community', href: '/community', icon: UserGroupIcon, activeIcon: UserGroupIconSolid },
    { name: 'Ask AI', href: '/ask-ai', icon: SparklesIcon, activeIcon: SparklesIconSolid },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
    { name: 'Hall of Fame', href: '/hall-of-fame', icon: TrophyIcon, activeIcon: TrophyIconSolid },
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
                                ? 'text-[var(--lavender-main)]'
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
