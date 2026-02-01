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
    const [department, setDepartment] = useState('all');
    const [totalParticipants, setTotalParticipants] = useState(0);

    useEffect(() => {
        fetchLeaderboard();
    }, [timeRange, department]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/leaderboard', {
                params: { timeRange, department, limit: 10 }
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

    const departments = [
        { id: 'all', label: 'All Departments' },
        { id: 'Computer', label: 'Computer' },
        { id: 'IT', label: 'IT' },
        { id: 'Electronics', label: 'Electronics' },
        { id: 'Mechanical', label: 'Mechanical' },
        { id: 'Civil', label: 'Civil' },
        { id: 'Electrical', label: 'Electrical' }
    ];

    // Department color mapping
    const getDepartmentColor = (department) => {
        const colors = {
            'Computer': 'bg-blue-50 text-blue-600 border-blue-200',
            'IT': 'bg-cyan-50 text-cyan-600 border-cyan-200',
            'Electronics': 'bg-orange-50 text-orange-600 border-orange-200',
            'Mechanical': 'bg-slate-100 text-slate-600 border-slate-300',
            'Civil': 'bg-amber-50 text-amber-700 border-amber-200',
            'Electrical': 'bg-yellow-50 text-yellow-700 border-yellow-200'
        };
        return colors[department] || 'bg-violet-50 text-violet-600 border-violet-200';
    };

    // Card styling for ranked positions
    const getCardStyle = (rank, isCurrentUser) => {
        const baseStyle = {
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
        };

        if (rank === 1) {
            // Gold - subtle but distinct
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.95) 0%, rgba(254, 243, 199, 0.9) 100%)',
                border: '1.5px solid rgba(202, 158, 40, 0.3)',
                boxShadow: '0 2px 8px rgba(180, 140, 30, 0.08)',
                borderRadius: '12px'
            };
        } else if (rank === 2) {
            // Silver - subtle
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.9) 100%)',
                border: '1.5px solid rgba(120, 140, 165, 0.25)',
                boxShadow: '0 2px 8px rgba(80, 100, 130, 0.06)',
                borderRadius: '12px'
            };
        } else if (rank === 3) {
            // Bronze - subtle
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(255, 251, 245, 0.95) 0%, rgba(254, 235, 220, 0.9) 100%)',
                border: '1.5px solid rgba(180, 120, 60, 0.2)',
                boxShadow: '0 2px 8px rgba(120, 80, 40, 0.05)',
                borderRadius: '12px'
            };
        }

        return {
            ...baseStyle,
            background: isCurrentUser ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.12)',
            boxShadow: '0 1px 4px rgba(139, 92, 246, 0.04)',
            borderRadius: '12px'
        };
    };

    // Get animation class - all top 3 with decreasing intensity
    const getAnimationClass = (rank) => {
        if (rank === 1) return 'animate-breathe-gold';
        if (rank === 2) return 'animate-breathe-silver';
        if (rank === 3) return 'animate-breathe-bronze';
        return '';
    };

    // Get title label with rank number for top 3 - clean, professional
    const getTitleLabel = (rank) => {
        if (rank === 1) return '#1 · Campus Champion';
        if (rank === 2) return '#2 · Top Contributor';
        if (rank === 3) return '#3 · Top Contributor';
        return null;
    };

    const getMedalStyle = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border border-amber-300';
            case 2:
                return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border border-slate-300';
            case 3:
                return 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-300';
            default:
                return 'bg-violet-50 text-violet-600 border border-violet-200';
        }
    };

    const getMedalEmoji = (rank) => {
        switch (rank) {
            case 1: return '👑'; // Crown for champion
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    const isCurrentUserInTop = currentUserRank &&
        leaderboard.some(u => u.userId === currentUserRank.userId);

    return (
        <div className="pb-20 space-y-4">
            {/* Header */}
            <div
                className="relative overflow-hidden rounded-2xl mx-3 md:mx-4 p-6 text-white"
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
                    <div className="flex items-center gap-3">
                        <div
                            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        >
                            <TrophyIconSolid className="w-7 h-7 text-yellow-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold drop-shadow-lg">Leaderboard</h1>
                            <p className="text-violet-100 text-sm">Updated daily · Based on upvotes, answers & posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="mx-3 md:mx-4">
                <div className="space-y-2">
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
                            {/* Compact Podium Highlight - Decorative Only */}
                            {leaderboard.length >= 3 && (
                                <div
                                    className="rounded-xl p-3 mb-2"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(217, 70, 239, 0.06) 100%)',
                                        border: '1px solid rgba(139, 92, 246, 0.12)'
                                    }}
                                >
                                    <div className="flex items-end justify-center gap-6 sm:gap-10">
                                        {/* 2nd Place */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer group"
                                            onClick={() => navigate(`/user/${leaderboard[1].userId}`)}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-lg sm:text-xl border-2 border-white shadow group-hover:scale-105 transition-transform">
                                                    🥈
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold">
                                                    2
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[60px]">{leaderboard[1].name.split(' ')[0]}</span>
                                            <span className="text-xs text-slate-500 font-semibold">{leaderboard[1].totalUpvotes} pts</span>
                                        </div>

                                        {/* 1st Place - Slightly Elevated */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer group -mt-3"
                                            onClick={() => navigate(`/user/${leaderboard[0].userId}`)}
                                        >
                                            <div className="text-lg mb-0.5">👑</div>
                                            <div className="relative">
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center text-xl sm:text-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                                                    🏆
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                                                    1
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 mt-1.5 truncate max-w-[70px]">{leaderboard[0].name.split(' ')[0]}</span>
                                            <span className="text-xs text-amber-600 font-bold">{leaderboard[0].totalUpvotes} pts</span>
                                        </div>

                                        {/* 3rd Place */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer group"
                                            onClick={() => navigate(`/user/${leaderboard[2].userId}`)}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center text-lg sm:text-xl border-2 border-white shadow group-hover:scale-105 transition-transform">
                                                    🥉
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                                    3
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[60px]">{leaderboard[2].name.split(' ')[0]}</span>
                                            <span className="text-xs text-orange-500 font-semibold">{leaderboard[2].totalUpvotes} pts</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Full Ranked Cards - All Users */}
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user.userId}
                                    onClick={() => navigate(`/user/${user.userId}`)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${user.rank === 1 ? 'animate-breathe-gold' : ''
                                        } ${user.userId === currentUserRank?.userId && user.rank > 3
                                            ? 'ring-2 ring-violet-300'
                                            : ''
                                        }`}
                                    style={{
                                        ...getCardStyle(user.rank, user.userId === currentUserRank?.userId),
                                        animationDelay: `${index * 30}ms`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    {/* Rank Badge */}
                                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${getMedalStyle(user.rank)}`}>
                                        {user.rank <= 3 ? getMedalEmoji(user.rank) : user.rank}
                                    </div>

                                    {/* User Info - Name Prominent */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold truncate ${user.rank === 1 ? 'text-amber-800' :
                                            user.rank === 2 ? 'text-slate-700' :
                                                user.rank === 3 ? 'text-orange-700' : 'text-gray-900'
                                            }`}>
                                            {user.name}
                                            {user.userId === currentUserRank?.userId && (
                                                <span className="ml-1.5 text-xs text-violet-600 font-medium">(You)</span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                            <span className={`px-1.5 py-0.5 rounded font-medium ${getDepartmentColor(user.department)}`}>
                                                {user.department}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span>{user.year}</span>
                                        </div>
                                    </div>

                                    {/* Stats - Readable at Glance */}
                                    <div className="flex items-center gap-3 text-xs">
                                        <div className="text-center">
                                            <div className="flex items-center gap-0.5 text-green-600 font-bold">
                                                <ChevronUpIcon className="w-3.5 h-3.5" />
                                                {user.totalUpvotes}
                                            </div>
                                            <div className="text-gray-400">upvotes</div>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <div className="flex items-center gap-0.5 text-violet-600 font-bold">
                                                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                                                {user.answerCount}
                                            </div>
                                            <div className="text-gray-400">answers</div>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <div className="flex items-center gap-0.5 text-fuchsia-600 font-bold">
                                                <DocumentTextIcon className="w-3.5 h-3.5" />
                                                {user.postCount}
                                            </div>
                                            <div className="text-gray-400">posts</div>
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

            {/* Fixed Footer - Filters & Stats */}
            <div
                className="fixed bottom-0 left-0 right-0 lg:left-[256px] xl:right-[296px] z-40 px-4 sm:px-4 lg:px-6 pb-4"
            >
                <div
                    className="max-w-4xl mx-auto rounded-2xl p-4"
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        boxShadow: '0 -4px 20px rgba(139, 92, 246, 0.1)'
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {timeRanges.map(range => (
                                <button
                                    key={range.id}
                                    onClick={() => setTimeRange(range.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${timeRange === range.id
                                        ? 'text-white shadow-md'
                                        : 'bg-white border border-violet-200 text-violet-600 hover:bg-violet-50'
                                        }`}
                                    style={timeRange === range.id ? {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    } : {}}
                                >
                                    {range.label}
                                </button>
                            ))}
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm font-medium text-violet-600 focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                            >
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">Contributors:</span>
                                <span className="font-bold text-violet-600">{totalParticipants}</span>
                            </div>
                            {currentUserRank && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl border border-violet-200">
                                    <span className="text-gray-600">Your Rank:</span>
                                    <span className="font-bold text-fuchsia-600">#{currentUserRank.rank}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
