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
    SparklesIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api/api';
import { postsAPI } from '../../services/api/postsService';

// Resource mapping - same as ForYouCard
const getResourceForUser = (department, year) => {
    const resourceMap = {
        Computer: {
            FE: { title: 'Engineering Mathematics-I Notes', subject: 'Engineering Mathematics-I' },
            SE: { title: 'Data Structures Guide', subject: 'Data Structures' },
            TE: { title: 'DBMS Study Material', subject: 'Database Management Systems' },
            BE: { title: 'Machine Learning Resources', subject: 'Machine Learning' }
        },
        IT: {
            FE: { title: 'Engineering Physics Notes', subject: 'Engineering Physics' },
            SE: { title: 'Web Technology Guide', subject: 'Web Technology' },
            TE: { title: 'Operating Systems Notes', subject: 'Operating Systems' },
            BE: { title: 'Cloud Computing Resources', subject: 'Cloud Computing' }
        },
        Electronics: {
            FE: { title: 'Basic Electrical Engineering', subject: 'Basic Electrical Engineering' },
            SE: { title: 'Digital Electronics Guide', subject: 'Digital Electronics' },
            TE: { title: 'Microprocessors Study Material', subject: 'Microprocessors' },
            BE: { title: 'Wireless Communication Notes', subject: 'Wireless Communication' }
        },
        Mechanical: {
            FE: { title: 'Engineering Mechanics Notes', subject: 'Engineering Mechanics' },
            SE: { title: 'Thermodynamics Guide', subject: 'Thermodynamics' },
            TE: { title: 'Heat Transfer Study Material', subject: 'Heat Transfer' },
            BE: { title: 'Automobile Engineering Resources', subject: 'Automobile Engineering' }
        },
        Civil: {
            FE: { title: 'Engineering Chemistry Notes', subject: 'Engineering Chemistry' },
            SE: { title: 'Surveying Complete Guide', subject: 'Surveying' },
            TE: { title: 'Structural Analysis Notes', subject: 'Structural Analysis' },
            BE: { title: 'Construction Management Resources', subject: 'Construction Management' }
        },
        Electrical: {
            FE: { title: 'Basic Electrical Engineering', subject: 'Basic Electrical Engineering' },
            SE: { title: 'Circuit Theory Guide', subject: 'Circuit Theory' },
            TE: { title: 'Power Systems Study Material', subject: 'Power Systems' },
            BE: { title: 'Smart Grid Resources', subject: 'Smart Grid' }
        }
    };

    return resourceMap[department]?.[year] || null;
};

const RightSidebar = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0
    });
    const [topContributor, setTopContributor] = useState(null);
    const [personalizedPosts, setPersonalizedPosts] = useState([]);
    const [recommendedResource, setRecommendedResource] = useState(null);
    const [loadingPersonalized, setLoadingPersonalized] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchStats();
            fetchPersonalizedContent();
        }
        fetchTopContributor();
    }, [user?.id]); // Add user.id as dependency

    const fetchPersonalizedContent = async () => {
        try {
            setLoadingPersonalized(true);
            console.log('Fetching personalized content...');
            const response = await postsAPI.getPersonalizedPosts();
            console.log('Personalized response:', response);

            setPersonalizedPosts(response.posts || []);

            // Get recommended resource
            if (response.personalizationInfo) {
                const resource = getResourceForUser(
                    response.personalizationInfo.department,
                    response.personalizationInfo.year
                );
                setRecommendedResource(resource);
            }
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
                {/* For You Card - Vibrant Blue Theme with Dynamic Content */}
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

                        {loadingPersonalized ? (
                            <div className="space-y-2">
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                                <div className="h-16 rounded-xl bg-white/10 animate-pulse"></div>
                            </div>
                        ) : personalizedPosts.length === 0 && !recommendedResource ? (
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
                                        className="block p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all cursor-pointer group/item"
                                    >
                                        <div className="flex items-start gap-2 mb-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90 font-medium flex-shrink-0">
                                                {post.matchLabel}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                                            {post.title}
                                        </p>
                                        <p className="text-xs text-white/70 mt-1">
                                            {post.author?.name}
                                        </p>
                                    </div>
                                ))}

                                {/* 1 Resource */}
                                {recommendedResource && (
                                    <div
                                        onClick={() => navigate('/resources')}
                                        className="block p-3 rounded-xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 hover:bg-emerald-500/30 hover:scale-[1.02] transition-all cursor-pointer group/item"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <BookOpenIcon className="w-4 h-4 text-emerald-200 group-hover/item:animate-bounce" />
                                            <p className="text-xs font-semibold text-emerald-100">📚 Your Department</p>
                                        </div>
                                        <p className="text-sm font-semibold text-white line-clamp-1">
                                            {recommendedResource.title}
                                        </p>
                                        <p className="text-xs text-white/80 line-clamp-1">
                                            {recommendedResource.subject}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
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
