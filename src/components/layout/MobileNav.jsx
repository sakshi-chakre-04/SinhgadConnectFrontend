import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    BellIcon as BellIconSolid,
    UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, activeIcon: BellIconSolid },
    { name: 'Profile', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
];

const MobileNav = () => {
    const location = useLocation();
    const { openModal } = useModal();

    return (
        <>
            {/* Bottom Navigation Bar */}
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
                                <Icon className="w-6 h-6" />
                                <span className="text-xs mt-1 font-medium">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Floating Action Button - Top Right on Mobile */}
            <button
                onClick={openModal}
                className="lg:hidden fixed top-4 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl active:scale-95 transition-all"
                aria-label="Create Post"
            >
                <PlusIcon className="w-7 h-7" />
            </button>
        </>
    );
};

export default MobileNav;
