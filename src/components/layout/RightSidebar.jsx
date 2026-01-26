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
    SparklesIcon
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
            const response = await api.get('/leaderboard', {
                params: { timeRange: 'all', limit: 1 }
            });

            const leaderboard = response.data.leaderboard || [];
            if (leaderboard.length > 0) {
                const topUser = leaderboard[0];
                setTopContributor({
                    name: topUser.name,
                    department: topUser.department,
                    posts: topUser.postCount || 0,
                    upvotes: topUser.totalUpvotes || 0
                });
            }
        } catch (error) {
            console.error('Error fetching top contributor:', error);
        }
    };

    return (
        <aside className="right-sidebar hidden xl:block !top-24">
            <div className="space-y-4">
                {/* For You Card - Vibrant Blue Theme */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    {/* Animated background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-white text-lg">For You</h3>
                        </div>

                        <div className="space-y-2">
                            <Link to="/posts" className="block p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all group/item">
                                <div className="flex items-center gap-2 mb-1">
                                    <FireIcon className="w-4 h-4 text-yellow-300 group-hover/item:animate-bounce" />
                                    <p className="text-sm font-semibold text-white">Latest Discussions</p>
                                </div>
                                <p className="text-xs text-white/80">Check out the newest posts</p>
                            </Link>

                            <Link to="/hall-of-fame" className="block p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all group/item">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrophyIcon className="w-4 h-4 text-yellow-300 group-hover/item:animate-bounce" />
                                    <p className="text-sm font-semibold text-white">Hall of Fame</p>
                                </div>
                                <p className="text-xs text-white/80">Top performers this month</p>
                            </Link>

                            <Link to="/resources" className="block p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all group/item">
                                <div className="flex items-center gap-2 mb-1">
                                    <DocumentTextIcon className="w-4 h-4 text-yellow-300 group-hover/item:animate-bounce" />
                                    <p className="text-sm font-semibold text-white">Resources</p>
                                </div>
                                <p className="text-xs text-white/80">Study materials & guides</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Your Activity Card - Vibrant Green Theme */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    {/* Animated background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                <FireIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Your Activity</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Posts */}
                            <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                                    <DocumentTextIcon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.totalPosts}</p>
                                <p className="text-xs text-white/80 font-medium">Posts</p>
                            </div>

                            {/* Comments */}
                            <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                                    <ChatBubbleLeftIcon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
                                <p className="text-xs text-white/80 font-medium">Comments</p>
                            </div>

                            {/* Upvotes */}
                            <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                                    <HandThumbUpIcon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.totalUpvotes}</p>
                                <p className="text-xs text-white/80 font-medium">Upvotes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Contributor Card - Vibrant Orange/Gold Theme */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    {/* Animated background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                <TrophyIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Top Contributor</h3>
                        </div>

                        {topContributor ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="text-2xl">🥇</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">
                                            {topContributor.name}
                                        </p>
                                        <p className="text-xs text-white/80">{topContributor.department}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-bold text-white">{topContributor.upvotes}</p>
                                        <p className="text-xs text-white/80">pts</p>
                                    </div>
                                </div>

                                <Link
                                    to="/leaderboard"
                                    className="block w-full text-center py-3 px-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold hover:bg-white/30 hover:scale-105 transition-all shadow-lg"
                                >
                                    View Leaderboard →
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-white/80 text-sm">
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
