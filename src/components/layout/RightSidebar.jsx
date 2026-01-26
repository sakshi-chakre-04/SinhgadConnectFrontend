import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import {
    DocumentTextIcon,
    ChatBubbleLeftIcon,
    HandThumbUpIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api/api';

const trendingTopics = [
    'PlacementSeason',
    'DSAPrep',
    'Internships',
    'CampusLife',
    'Hackathons',
    'GATEPrep',
    'ProjectIdeas'
];

const RightSidebar = () => {
    const user = useSelector(selectUser);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0
    });

    useEffect(() => {
        if (user?.id) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/posts/user/${user.id}`);
            setStats({
                totalPosts: response.data.stats?.totalPosts || 0,
                totalComments: 0,
                totalUpvotes: response.data.stats?.totalUpvotes || 0
            });

            const commentsRes = await api.get(`/comments/user/${user.id}`);
            setStats(prev => ({
                ...prev,
                totalComments: commentsRes.data.stats?.totalComments || 0
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <aside className="right-sidebar hidden xl:block !top-24">
            {/* Quick Stats - Modern Gradient Card */}
            <div className="relative overflow-hidden rounded-2xl mb-6 p-5 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 pointer-events-none"></div>

                <div className="relative z-10">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <FireIcon className="w-4 h-4 text-white" />
                        </div>
                        Quick Stats
                    </h3>

                    <div className="space-y-3">
                        {/* Posts */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <DocumentTextIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalPosts}</p>
                                <p className="text-xs text-gray-600 font-medium">Posts</p>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                                <ChatBubbleLeftIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalComments}</p>
                                <p className="text-xs text-gray-600 font-medium">Comments</p>
                            </div>
                        </div>

                        {/* Upvotes */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100/50 hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                                <HandThumbUpIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{stats.totalUpvotes}</p>
                                <p className="text-xs text-gray-600 font-medium">Upvotes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Topics - Vibrant Animated Card */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 border border-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative">
                            <span className="text-2xl animate-pulse">🔥</span>
                            <div className="absolute inset-0 blur-md bg-orange-400/30 rounded-full"></div>
                        </div>
                        <h3 className="font-bold text-transparent bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-lg">
                            Trending Topics
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {trendingTopics.map((topic, index) => {
                            const gradients = [
                                'from-blue-500 to-cyan-500',
                                'from-purple-500 to-pink-500',
                                'from-orange-500 to-red-500',
                                'from-green-500 to-emerald-500',
                                'from-indigo-500 to-purple-500',
                                'from-pink-500 to-rose-500',
                                'from-violet-500 to-fuchsia-500'
                            ];
                            const bgGradients = [
                                'from-blue-50 to-cyan-50',
                                'from-purple-50 to-pink-50',
                                'from-orange-50 to-red-50',
                                'from-green-50 to-emerald-50',
                                'from-indigo-50 to-purple-50',
                                'from-pink-50 to-rose-50',
                                'from-violet-50 to-fuchsia-50'
                            ];

                            return (
                                <Link
                                    key={topic}
                                    to={`/search?q=${topic}`}
                                    className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r ${bgGradients[index]} hover:shadow-md transition-all duration-200 border border-transparent hover:border-purple-200 hover:scale-[1.02]`}
                                >
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-shadow`}>
                                        <span className="text-xs font-bold text-white">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-700 group-hover/item:text-gray-900 font-medium transition-colors flex-1">
                                        {topic}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover/item:text-purple-600 transition-colors opacity-0 group-hover/item:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
