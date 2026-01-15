import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';
import { api } from '../services/api/api';
import {
    FireIcon,
    ChevronUpIcon,
    ChatBubbleLeftIcon,
    ClockIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/24/solid';

const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

const Trending = () => {
    const token = useSelector(selectToken);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'all'

    useEffect(() => {
        fetchTrendingPosts();
    }, [timeRange]);

    const fetchTrendingPosts = async () => {
        try {
            setLoading(true);
            // Fetch posts sorted by upvotes (trending)
            const response = await api.get('/posts', {
                params: { sortBy: 'upvotes', limit: 20 }
            });

            let allPosts = response.data.posts || [];

            // Filter by time range
            const now = new Date();
            const filtered = allPosts.filter(post => {
                const postDate = new Date(post.createdAt);
                const diffDays = (now - postDate) / (1000 * 60 * 60 * 24);

                switch (timeRange) {
                    case 'day': return diffDays <= 1;
                    case 'week': return diffDays <= 7;
                    case 'month': return diffDays <= 30;
                    default: return true;
                }
            });

            // Sort by engagement score (upvotes + comments)
            filtered.sort((a, b) => {
                const scoreA = (a.upvoteCount || a.upvotes?.length || 0) + (a.commentCount || 0) * 2;
                const scoreB = (b.upvoteCount || b.upvotes?.length || 0) + (b.commentCount || 0) * 2;
                return scoreB - scoreA;
            });

            setPosts(filtered);
        } catch (error) {
            console.error('Error fetching trending posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const timeRanges = [
        { id: 'day', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'all', label: 'All Time' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

                <div className="relative z-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <FireIconSolid className="w-10 h-10 text-yellow-300 animate-pulse" />
                        <h1 className="text-3xl font-bold">Trending Posts</h1>
                    </div>
                    <p className="text-white/80 text-lg">Discover what's hot in the Sinhgad community</p>
                </div>
            </div>

            {/* Time Range Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {timeRanges.map(range => (
                    <button
                        key={range.id}
                        onClick={() => setTimeRange(range.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${timeRange === range.id
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 glass-panel rounded-2xl border border-white/40">
                        <FireIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No trending posts for this period</p>
                        <p className="text-gray-400 text-sm mt-1">Try a different time range</p>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <Link
                            key={post._id}
                            to={`/posts/${post._id}`}
                            className="block bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:bg-white/80 transition-all border border-white/50 overflow-hidden group transform hover:-translate-y-1"
                        >
                            <div className="flex items-start p-5 gap-4">
                                {/* Rank Badge */}
                                <div className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-orange-500 text-white shadow-orange-500/30' :
                                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-slate-500/30' :
                                        index === 2 ? 'bg-gradient-to-br from-orange-300 to-amber-600 text-white shadow-orange-900/20' :
                                            'bg-white text-gray-400 border border-gray-100'
                                    }`}>
                                    {index < 3 && <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-slow"></div>}
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                                        {post.summary || post.content?.substring(0, 120)}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-5 mt-4 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100">
                                            <ChevronUpIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            <span>{post.upvoteCount || post.upvotes?.length || 0}</span>
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                                            <ChatBubbleLeftIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            <span>{post.commentCount || 0}</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            {formatRelativeDate(post.createdAt)}
                                        </span>
                                        <span className="text-gray-400 ml-auto flex items-center gap-1">
                                            by <span className="text-gray-600">{post.author?.name || 'Anonymous'}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Fire indicator for top 3 */}
                                {index < 3 && (
                                    <div className="flex flex-col items-center justify-center">
                                        <FireIconSolid className={`w-6 h-6 ${index === 0 ? 'text-orange-500 animate-bounce' :
                                            index === 1 ? 'text-slate-400' : 'text-amber-500'
                                            } filter drop-shadow-md`} />
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Trending;
