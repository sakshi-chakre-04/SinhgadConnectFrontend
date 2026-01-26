import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import {
    DocumentTextIcon,
    ChatBubbleLeftIcon,
    HandThumbUpIcon,
    FireIcon,
    TrophyIcon,
    SparklesIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api/api';

const RightSidebar = () => {
    const user = useSelector(selectUser);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0
    });
    const [topContributor, setTopContributor] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchStats();
        }
        fetchTopContributor();
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

    const fetchTopContributor = async () => {
        try {
            // This is a placeholder - you'll need to implement the actual API endpoint
            // For now, we'll use mock data
            setTopContributor({
                name: 'Top User',
                department: 'Computer',
                posts: 42,
                upvotes: 156
            });
        } catch (error) {
            console.error('Error fetching top contributor:', error);
        }
    };

    return (
        <aside className="right-sidebar hidden xl:block !top-24">
            <div className="space-y-4">
                {/* For You Card */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <SparklesIcon className="w-4 h-4 text-white" />
                            </div>
                            For You
                        </h3>

                        <div className="space-y-3">
                            <Link to="/posts" className="block p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-2 mb-1">
                                    <FireIcon className="w-4 h-4 text-blue-600" />
                                    <p className="text-sm font-semibold text-gray-800">Latest Discussions</p>
                                </div>
                                <p className="text-xs text-gray-600">Check out the newest posts</p>
                            </Link>

                            <Link to="/hall-of-fame" className="block p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrophyIcon className="w-4 h-4 text-purple-600" />
                                    <p className="text-sm font-semibold text-gray-800">Hall of Fame</p>
                                </div>
                                <p className="text-xs text-gray-600">Top performers this month</p>
                            </Link>

                            <Link to="/resources" className="block p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100/50 hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-2 mb-1">
                                    <DocumentTextIcon className="w-4 h-4 text-violet-600" />
                                    <p className="text-sm font-semibold text-gray-800">Resources</p>
                                </div>
                                <p className="text-xs text-gray-600">Study materials & guides</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Your Activity Card */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <FireIcon className="w-4 h-4 text-white" />
                            </div>
                            Your Activity
                        </h3>

                        <div className="space-y-3">
                            {/* Posts */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                    <DocumentTextIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalPosts}</p>
                                    <p className="text-xs text-gray-600 font-medium">Posts</p>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                                    <ChatBubbleLeftIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalComments}</p>
                                    <p className="text-xs text-gray-600 font-medium">Comments</p>
                                </div>
                            </div>

                            {/* Upvotes */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100/50">
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

                {/* Top Contributor Card */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-amber-50/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                <TrophyIcon className="w-4 h-4 text-white" />
                            </div>
                            Top Contributor
                        </h3>

                        {topContributor ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100/50">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-md">
                                        <UserIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">{topContributor.name}</p>
                                        <p className="text-xs text-gray-600">{topContributor.department}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 text-center">
                                        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{topContributor.posts}</p>
                                        <p className="text-xs text-gray-600">Posts</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50 text-center">
                                        <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{topContributor.upvotes}</p>
                                        <p className="text-xs text-gray-600">Upvotes</p>
                                    </div>
                                </div>

                                <Link to="/hall-of-fame" className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-medium hover:shadow-md transition-all">
                                    View Leaderboard
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                Loading top contributor...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
