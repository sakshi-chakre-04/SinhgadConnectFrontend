import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import {
    DocumentTextIcon,
    ChatBubbleLeftIcon,
    HandThumbUpIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api/api';
import { useTheme } from '../../context/ThemeContext';

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
    const { isDarkMode } = useTheme();
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
        <aside className="right-sidebar hidden xl:block">
            {/* Quick Stats */}
            <div className="stats-card mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>
                    <SparklesIcon className="w-5 h-5 text-primary-500" />
                    Quick Stats
                </h3>

                <div className="space-y-3">
                    <div className="stat-item">
                        <div className="stat-icon bg-indigo-100">
                            <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>{stats.totalPosts}</p>
                            <p className="text-xs text-gray-500">Posts</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon bg-green-100">
                            <ChatBubbleLeftIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>{stats.totalComments}</p>
                            <p className="text-xs text-gray-500">Comments</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon bg-orange-100">
                            <HandThumbUpIcon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>{stats.totalUpvotes}</p>
                            <p className="text-xs text-gray-500">Upvotes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Topics */}
            <div className="card-flat p-4">
                <h3 className="font-semibold mb-4" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>🔥 Trending Topics</h3>
                <div className="space-y-1">
                    {trendingTopics.map((topic) => (
                        <Link
                            key={topic}
                            to={`/search?q=${topic}`}
                            className="trending-item text-sm"
                        >
                            {topic}
                        </Link>
                    ))}
                </div>
            </div>

            {/* AI Assistant Promo */}
            <div className="mt-6 p-4 rounded-xl gradient-primary text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold">AI Assistant</p>
                        <p className="text-xs text-white/80">Powered by Gemini</p>
                    </div>
                </div>
                <p className="text-sm text-white/90 mb-3">
                    Ask questions about placements, academics, or campus life!
                </p>
                <p className="text-xs text-white/70">
                    Click the chat bubble at bottom right →
                </p>
            </div>
        </aside>
    );
};

export default RightSidebar;
