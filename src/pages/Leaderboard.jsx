import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from '../features/auth/authSlice';
import { api } from '../services/api/api';
import {
    ArrowLeftIcon,
    TrophyIcon,
    ChevronUpIcon,
    ChatBubbleLeftIcon,
    DocumentTextIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

const Leaderboard = () => {
    const token = useSelector(selectToken);
    const currentUser = useSelector(selectUser);
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all');
    const [totalParticipants, setTotalParticipants] = useState(0);

    useEffect(() => {
        fetchLeaderboard();
    }, [timeRange]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/leaderboard', {
                params: { timeRange, limit: 20 }
            });

            setLeaderboard(response.data.leaderboard || []);
            setCurrentUserRank(response.data.currentUserRank);
            setTotalParticipants(response.data.totalParticipants || 0);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const timeRanges = [
        { id: 'month', label: 'This Month' },
        { id: 'all', label: 'All Time' }
    ];

    const getMedalStyle = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-lg shadow-amber-500/30';
            case 2:
                return 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-500/30';
            case 3:
                return 'bg-gradient-to-br from-orange-300 to-amber-600 text-white shadow-lg shadow-orange-500/20';
            default:
                return 'bg-violet-50 text-violet-600 border border-violet-200';
        }
    };

    const getMedalEmoji = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    const isCurrentUserInTop = currentUserRank &&
        leaderboard.some(u => u.userId === currentUserRank.userId);

    return (
        <div className="pb-20">
            <div className="max-w-4xl mx-auto px-0 md:px-4 space-y-6">
                {/* Header */}
                <div
                    className="relative overflow-hidden rounded-2xl mx-3 md:mx-0 p-8 text-white"
                    style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
                        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
                    }}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full"></div>

                    <div className="relative z-10">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                            >
                                <TrophyIconSolid className="w-8 h-8 text-yellow-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold drop-shadow-lg">Leaderboard</h1>
                                <p className="text-violet-100 text-sm">Top contributors in the community</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Range Filter */}
                <div className="px-4 md:px-0 space-y-6">
                    <div className="flex gap-2">
                        {timeRanges.map(range => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${timeRange === range.id
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/80 border border-violet-200 text-violet-600 hover:bg-violet-50'
                                    }`}
                                style={timeRange === range.id ? {
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                } : {}}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="rounded-2xl p-5 text-center"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                            }}
                        >
                            <div className="text-3xl font-bold text-violet-600">{totalParticipants}</div>
                            <div className="text-sm text-gray-500 mt-1 font-medium">Contributors</div>
                        </div>
                        <div
                            className="rounded-2xl p-5 text-center"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(217, 70, 239, 0.2)',
                                boxShadow: '0 4px 20px rgba(217, 70, 239, 0.08)'
                            }}
                        >
                            <div className="text-3xl font-bold text-fuchsia-600">
                                {currentUserRank ? `#${currentUserRank.rank}` : '-'}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 font-medium">Your Rank</div>
                        </div>
                    </div>

                    {/* Leaderboard List */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div
                                className="text-center py-12 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(139, 92, 246, 0.15)'
                                }}
                            >
                                <TrophyIcon className="w-16 h-16 mx-auto text-violet-300 mb-4" />
                                <p className="text-gray-700 font-semibold">No contributors yet</p>
                                <p className="text-gray-500 text-sm mt-1">Be the first to help others!</p>
                            </div>
                        ) : (
                            <>
                                {leaderboard.map((user, index) => (
                                    <div
                                        key={user.userId}
                                        onClick={() => navigate(`/user/${user.userId}`)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer hover:scale-[1.01] ${user.userId === currentUserRank?.userId
                                            ? 'ring-2 ring-violet-300'
                                            : ''
                                            }`}
                                        style={{
                                            background: user.userId === currentUserRank?.userId
                                                ? 'rgba(139, 92, 246, 0.1)'
                                                : 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(139, 92, 246, 0.15)',
                                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.06)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.06)';
                                        }}
                                    >
                                        {/* Rank Badge */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${getMedalStyle(user.rank)}`}>
                                            {getMedalEmoji(user.rank) || user.rank}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {user.name}
                                                    {user.userId === currentUserRank?.userId && (
                                                        <span className="ml-2 text-xs text-violet-600 font-medium">(You)</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full font-medium">{user.department}</span>
                                                <span>•</span>
                                                <span>{user.year}</span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                                    <ChevronUpIcon className="w-4 h-4" strokeWidth={2.5} />
                                                    {user.totalUpvotes}
                                                </div>
                                                <div className="text-xs text-gray-400">upvotes</div>
                                            </div>
                                            <div className="text-center hidden sm:block">
                                                <div className="flex items-center gap-1 text-violet-600 font-semibold">
                                                    <ChatBubbleLeftIcon className="w-4 h-4" />
                                                    {user.answerCount}
                                                </div>
                                                <div className="text-xs text-gray-400">answers</div>
                                            </div>
                                            <div className="text-center hidden sm:block">
                                                <div className="flex items-center gap-1 text-fuchsia-600 font-semibold">
                                                    <DocumentTextIcon className="w-4 h-4" />
                                                    {user.postCount}
                                                </div>
                                                <div className="text-xs text-gray-400">posts</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Current User Card (if not in top 20) */}
                                {currentUserRank && !isCurrentUserInTop && (
                                    <>
                                        <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                                            <div className="w-8 h-px bg-violet-200"></div>
                                            <span className="text-xs font-medium">Your Position</span>
                                            <div className="w-8 h-px bg-violet-200"></div>
                                        </div>
                                        <div
                                            onClick={() => navigate(`/user/${currentUserRank.userId}`)}
                                            className="flex items-center gap-4 p-4 rounded-2xl ring-2 ring-violet-300 cursor-pointer hover:shadow-lg transition-all"
                                            style={{
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(139, 92, 246, 0.2)'
                                            }}
                                        >
                                            {/* Rank Badge */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-violet-100 text-violet-600 border border-violet-200">
                                                {currentUserRank.rank}
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {currentUserRank.name}
                                                        <span className="ml-2 text-xs text-violet-600 font-medium">(You)</span>
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full font-medium">{currentUserRank.department}</span>
                                                    <span>•</span>
                                                    <span>{currentUserRank.year}</span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                                                        <ChevronUpIcon className="w-4 h-4" strokeWidth={2.5} />
                                                        {currentUserRank.totalUpvotes}
                                                    </div>
                                                    <div className="text-xs text-gray-400">upvotes</div>
                                                </div>
                                                <div className="text-center hidden sm:block">
                                                    <div className="flex items-center gap-1 text-violet-600 font-semibold">
                                                        <ChatBubbleLeftIcon className="w-4 h-4" />
                                                        {currentUserRank.answerCount}
                                                    </div>
                                                    <div className="text-xs text-gray-400">answers</div>
                                                </div>
                                                <div className="text-center hidden sm:block">
                                                    <div className="flex items-center gap-1 text-fuchsia-600 font-semibold">
                                                        <DocumentTextIcon className="w-4 h-4" />
                                                        {currentUserRank.postCount}
                                                    </div>
                                                    <div className="text-xs text-gray-400">posts</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
