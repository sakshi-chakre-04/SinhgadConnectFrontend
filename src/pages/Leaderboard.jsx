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
    DocumentTextIcon
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
                return 'bg-white text-gray-500 border border-gray-200';
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #607BE7 20%, #7666EC 40%, #8651F1 60%, #A23CF4 80%, #B82FF8 90%, #CD13FC 100%)' }}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

                <div className="relative z-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <TrophyIconSolid className="w-10 h-10 text-yellow-300 animate-pulse" />
                        <h1 className="text-3xl font-bold">Leaderboard</h1>
                    </div>
                    <p className="text-white/80 text-lg">Top helpers making a difference in the Sinhgad community</p>
                </div>
            </div>

            {/* Time Range Filter */}
            <div className="flex gap-2">
                {timeRanges.map(range => (
                    <button
                        key={range.id}
                        onClick={() => setTimeRange(range.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${timeRange === range.id
                            ? 'text-white shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-600 hover:text-white'
                            }`}
                        style={timeRange === range.id ? { backgroundColor: '#8651F1' } : {}}
                        onMouseEnter={(e) => { if (timeRange !== range.id) e.target.style.backgroundColor = '#A23CF4'; }}
                        onMouseLeave={(e) => { if (timeRange !== range.id) e.target.style.backgroundColor = ''; }}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-4 text-center border" style={{ background: 'linear-gradient(to bottom right, rgba(134, 81, 241, 0.1), rgba(162, 60, 244, 0.1))', borderColor: '#8651F1' }}>
                    <div className="text-2xl font-bold" style={{ color: '#8651F1' }}>{totalParticipants}</div>
                    <div className="text-xs text-gray-600 mt-1">Contributors</div>
                </div>
                <div className="rounded-2xl p-4 text-center border" style={{ background: 'linear-gradient(to bottom right, rgba(205, 19, 252, 0.1), rgba(184, 47, 248, 0.1))', borderColor: '#CD13FC' }}>
                    <div className="text-2xl font-bold" style={{ color: '#CD13FC' }}>
                        {currentUserRank ? `#${currentUserRank.rank}` : '-'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Your Rank</div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                        <TrophyIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No contributors yet</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to help others!</p>
                    </div>
                ) : (
                    <>
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.userId}
                                onClick={() => navigate(`/user/${user.userId}`)}
                                className={`flex items-center gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${user.userId === currentUserRank?.userId
                                    ? 'border-purple-300 bg-purple-50/50 ring-2 ring-purple-200'
                                    : 'border-white/50 hover:border-purple-200'
                                    }`}
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
                                                <span className="ml-2 text-xs text-purple-600 font-medium">(You)</span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{user.department}</span>
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
                                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                            <ChatBubbleLeftIcon className="w-4 h-4" />
                                            {user.answerCount}
                                        </div>
                                        <div className="text-xs text-gray-400">answers</div>
                                    </div>
                                    <div className="text-center hidden sm:block">
                                        <div className="flex items-center gap-1 text-purple-600 font-semibold">
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
                                    <div className="w-8 h-px bg-gray-200"></div>
                                    <span className="text-xs">Your Position</span>
                                    <div className="w-8 h-px bg-gray-200"></div>
                                </div>
                                <div
                                    onClick={() => navigate(`/user/${currentUserRank.userId}`)}
                                    className="flex items-center gap-4 p-4 bg-purple-50/80 backdrop-blur-sm rounded-2xl border border-purple-200 ring-2 ring-purple-100 cursor-pointer hover:shadow-lg transition-all"
                                >
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-purple-100 text-purple-600 border border-purple-200">
                                        {currentUserRank.rank}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {currentUserRank.name}
                                                <span className="ml-2 text-xs text-purple-600 font-medium">(You)</span>
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <span className="px-2 py-0.5 bg-purple-100 rounded-full">{currentUserRank.department}</span>
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
                                            <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                                <ChatBubbleLeftIcon className="w-4 h-4" />
                                                {currentUserRank.answerCount}
                                            </div>
                                            <div className="text-xs text-gray-400">answers</div>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <div className="flex items-center gap-1 text-purple-600 font-semibold">
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
    );
};

export default Leaderboard;
