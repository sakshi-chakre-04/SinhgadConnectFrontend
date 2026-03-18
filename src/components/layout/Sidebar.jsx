import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsPro } from '../../features/auth/authSlice';
import ProUpgradeModal from '../ProUpgradeModal';
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
    SparklesIcon,
    XMarkIcon
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

const Sidebar = ({ onCreatePost, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const isPro = useSelector(selectIsPro);
    const [showProModal, setShowProModal] = useState(false);
    const [showProCard, setShowProCard] = useState(() => !localStorage.getItem('hideSidebarProCard'));

    const handleCloseCard = (e) => {
        e.stopPropagation();
        setShowProCard(false);
        localStorage.setItem('hideSidebarProCard', 'true');
    };

    return (
        <nav className={`hidden lg:flex flex-col fixed left-4 top-[72px] bottom-4 ${isCollapsed ? 'w-[72px]' : 'w-[240px]'} glass-panel rounded-xl ${isCollapsed ? 'p-3' : 'p-5'} z-30 transition-all duration-300 border border-white/60 shadow-2xl shadow-indigo-500/10`}>
            {/* Collapse/Expand Button */}
            <button
                onClick={onToggleCollapse}
                className={`absolute -right-3 top-6 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-white/60 flex items-center justify-center hover:scale-110 transition-all duration-200 z-40 hover:bg-gray-50 ${isCollapsed ? 'rotate-180' : ''}`}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

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
                            className={`group relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} ${isCollapsed ? 'px-0' : 'px-4'} py-3.5 rounded-xl transition-all duration-300 ease-out
                                ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-600 hover:shadow-sm'
                                }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 blur-md opacity-30 -z-10"></div>
                            )}
                            <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            {!isCollapsed && <span className="font-medium text-[0.95rem] tracking-wide">{item.name}</span>}

                            {/* Active Indicator Dot (Optional decorative element) */}
                            {!isActive && !isCollapsed && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* Pro Upgrade Card - only for non-pro users */}
            {!isPro && showProCard && !isCollapsed && (
                <div className="mt-4 mb-4 p-4 rounded-xl relative overflow-hidden cursor-pointer group" onClick={() => setShowProModal(true)}
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #d946ef 100%)' }}>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_white,_transparent)]" />
                    
                    {/* Close Button */}
                    <button 
                        onClick={handleCloseCard}
                        className="absolute top-2 right-2 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
                        title="Dismiss"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>

                    <p className="text-white font-bold text-sm">⚡ Upgrade to Pro</p>
                    <p className="text-purple-100 text-xs mt-1">10 chats/day → 100/day</p>
                    <div className="mt-3 bg-white/20 hover:bg-white/30 transition text-white text-xs font-semibold py-1.5 px-3 rounded-xl text-center">
                        Get Pro — ₹99/month
                    </div>
                </div>
            )}
            {isPro && (
                <div className="mt-4 mb-4 p-3 rounded-xl text-center"
                    style={{ background: 'linear-gradient(135deg, #f59e0b22, #f9731622)' }}>
                    <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>⚡ PRO Member</span>
                    <p className="text-gray-400 text-xs mt-0.5">100 chats/day</p>
                </div>
            )}

            {/* Create Post Button */}
            <div className={`pt-2 ${!isCollapsed ? 'border-t border-gray-100' : ''}`}>
                <button
                    onClick={() => onCreatePost('Create Post')}
                    className={`relative group ${isCollapsed ? 'w-full aspect-square' : 'w-full'} ${isCollapsed ? 'py-0' : 'py-4'} ${isCollapsed ? 'px-0' : 'px-6'} rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95`}
                    title={isCollapsed ? 'Create Post' : ''}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:bg-[length:200%_200%] animate-gradient-xy transition-all duration-300"></div>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15)' }}></div>
                    <div className={`relative flex items-center justify-center ${isCollapsed ? '' : 'gap-3'} text-white font-bold tracking-wide`}>
                        <PlusCircleIcon className={`w-6 h-6 group-hover:rotate-90 transition-transform duration-500`} />
                        {!isCollapsed && <span>Create Post</span>}
                    </div>
                </button>
            </div>
            {showProModal && <ProUpgradeModal onClose={() => setShowProModal(false)} />}
        </nav>
    );
};

export default Sidebar;
