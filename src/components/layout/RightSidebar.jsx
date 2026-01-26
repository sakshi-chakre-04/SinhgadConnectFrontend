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

            {/* Trending Topics - Modern Gradient Card */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-pink-50/30 to-purple-50/20 pointer-events-none"></div>

                <div className="relative z-10">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                        <span className="text-xl">🔥</span>
                        Trending Topics
                    </h3>
                    <div className="space-y-2">
                        {trendingTopics.map((topic, index) => (
                            <Link
                                key={topic}
                                to={`/search?q=${topic}`}
                                className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-purple-100"
                            >
                                <span className="text-xs font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                                    #{index + 1}
                                </span>
                                <span className="text-sm text-gray-700 group-hover:text-purple-700 font-medium transition-colors">
                                    {topic}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
