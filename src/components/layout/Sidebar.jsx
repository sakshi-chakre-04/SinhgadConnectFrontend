import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    PlusCircleIcon,
    ChartBarIcon,
    TrophyIcon,
    BookOpenIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    BellIcon as BellIconSolid,
    UserIcon as UserIconSolid,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
    ChartBarIcon as ChartBarIconSolid,
    TrophyIcon as TrophyIconSolid,
    BookOpenIcon as BookOpenIconSolid,
    SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
    { name: 'Hall of Fame', href: '/hall-of-fame', icon: TrophyIcon, activeIcon: TrophyIconSolid },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
    { name: 'Community', href: '/community', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleLeftRightIconSolid },
];

const Sidebar = ({ onCreatePost }) => {
    const location = useLocation();

    return (
        <nav className="hidden lg:flex flex-col fixed left-4 top-[72px] bottom-4 w-[240px] glass-panel rounded-[2rem] p-5 z-30 transition-all duration-300 border border-white/60 shadow-2xl shadow-indigo-500/10">
            {/* Navigation Items */}
            <div className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide py-2 mt-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ease-out
                                ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-600 hover:shadow-sm'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 blur-md opacity-30 -z-10"></div>
                            )}
                            <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-[0.95rem] tracking-wide">{item.name}</span>

                            {/* Active Indicator Dot (Optional decorative element) */}
                            {!isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* Create Post Button */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                    onClick={() => onCreatePost('Create Post')}
                    className="relative group w-full py-4 px-6 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:bg-[length:200%_200%] animate-gradient-xy transition-all duration-300"></div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15)' }}></div>
                    <div className="relative flex items-center justify-center gap-3 text-white font-bold tracking-wide">
                        <PlusCircleIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        <span>Create Post</span>
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;
