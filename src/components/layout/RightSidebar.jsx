import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { postsAPI } from '../../services/api/postsService';

const RightSidebar = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0
    });
    const [topContributor, setTopContributor] = useState([]);
    const [personalizedPosts, setPersonalizedPosts] = useState([]);
    const [loadingPersonalized, setLoadingPersonalized] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchStats();
            fetchPersonalizedContent();
        }
        fetchTopContributors();
    }, [user?.id]); // Add user.id as dependency

    const fetchPersonalizedContent = async () => {
        try {
            setLoadingPersonalized(true);
            console.log('Fetching personalized content...');
            const response = await postsAPI.getPersonalizedPosts();
            console.log('Personalized response:', response);

            setPersonalizedPosts(response.posts || []);
        } catch (error) {
            console.error('Failed to fetch personalized content:', error);
            setPersonalizedPosts([]);
        } finally {
            setLoadingPersonalized(false);
        }
    };

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


    const fetchTopContributors = async () => {
        try {
            const response = await api.get('/leaderboard', {
                params: { timeRange: 'all', limit: 3 }
            });

            const leaderboard = response.data.leaderboard || [];
            if (leaderboard.length > 0) {
                setTopContributor(leaderboard.map(user => ({
                    name: user.name,
                    department: user.department,
                    posts: user.postCount || 0,
                    upvotes: user.totalUpvotes || 0
                })));
            }
        } catch (error) {
            console.error('Error fetching top contributors:', error);
        }
    };

    return (
        <aside className="right-sidebar hidden xl:block !top-24 max-h-[calc(100vh-110px)] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/30 scrollbar-track-transparent">
            <div className="space-y-3">
                {/* For You Card - Ultra Compact */}
                <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl">
                    {/* Animated background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="w-4 h-4 text-white" />
                            <h3 className="font-bold text-white text-sm">For You</h3>
                        </div>

                        {loadingPersonalized ? (
                            <div className="space-y-2">
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                            </div>
                        ) : personalizedPosts.length === 0 ? (
                            <div className="text-center py-6 text-white/80 text-sm">
                                <p className="mb-2">Start Your Journey</p>
                                <p className="text-xs text-white/60">Upvote posts to get personalized recommendations</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* 2 Personalized/Trending Posts */}
                                {personalizedPosts.map((post, index) => (
                                    <div
                                        key={post._id}
                                        onClick={() => navigate(`/posts/${post._id}`)}
                                        className="block p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/25 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 transition-all duration-200 cursor-pointer group/item"
                                    >
                                        <div className="flex items-start gap-2 mb-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90 font-medium flex-shrink-0">
                                                {post.matchLabel}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                                            {post.title}
                                        </p>
                                    </div>
                                ))}


                            </div>
                        )}
                    </div>
                </div>

                {/* Your Activity - Ultra Compact */}
                <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <FireIcon className="w-4 h-4 text-white" />
                            <h3 className="font-bold text-white text-sm">Your Activity</h3>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            {/* Posts */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex-1 justify-center hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-default" title="Posts">
                                <DocumentTextIcon className="w-4 h-4 text-white/80" />
                                <span className="text-lg font-bold text-white">{stats.totalPosts}</span>
                            </div>

                            {/* Comments */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex-1 justify-center hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-default" title="Comments">
                                <ChatBubbleLeftIcon className="w-4 h-4 text-white/80" />
                                <span className="text-lg font-bold text-white">{stats.totalComments}</span>
                            </div>

                            {/* Upvotes */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex-1 justify-center hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-default" title="Upvotes">
                                <HandThumbUpIcon className="w-4 h-4 text-white/80" />
                                <span className="text-lg font-bold text-white">{stats.totalUpvotes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Contributors - Ultra Compact */}
                <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <TrophyIcon className="w-4 h-4 text-white" />
                            <h3 className="font-bold text-white text-sm">Top Contributors</h3>
                        </div>

                        {topContributor.length > 0 ? (
                            <Link to="/leaderboard" className="space-y-1.5 block">
                                {topContributor.map((contributor, index) => {
                                    const styles = [
                                        'bg-white/25 border-white/40', // 1st - brightest
                                        'bg-white/15 border-white/25', // 2nd - medium
                                        'bg-white/10 border-white/15'  // 3rd - subtle
                                    ];
                                    const textStyles = [
                                        'text-white font-bold',     // 1st
                                        'text-white/90 font-semibold', // 2nd
                                        'text-white/80 font-medium'  // 3rd
                                    ];
                                    return (
                                        <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${styles[index]} backdrop-blur-sm border hover:bg-white/35 hover:scale-[1.02] hover:shadow-md hover:shadow-white/10 transition-all duration-200`}>
                                            <span className="text-base w-5 text-center">{['🥇', '🥈', '🥉'][index]}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm truncate ${textStyles[index]}`}>{contributor.name}</p>
                                            </div>
                                            <p className={`text-xs flex-shrink-0 ${textStyles[index]}`}>{contributor.upvotes} pts</p>
                                        </div>
                                    );
                                })}
                            </Link>
                        ) : (
                            <div className="text-center py-4 text-white/80 text-sm">
                                Loading...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
