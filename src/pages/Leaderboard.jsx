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

    // Premium card styling for top 3 positions
    const getCardStyle = (rank, isCurrentUser) => {
        const baseStyle = {
            backdropFilter: 'blur(12px)',
            animationFillMode: 'backwards',
            transition: 'all 0.4s ease'
        };

        if (rank === 1) {
            // Champion - Softer "award certificate" gold with more white
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(255, 253, 245, 0.97) 0%, rgba(255, 250, 235, 0.94) 50%, rgba(254, 245, 215, 0.9) 100%)',
                border: '2px solid rgba(202, 158, 40, 0.3)',
                boxShadow: '0 10px 40px rgba(180, 140, 30, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
                borderRadius: '20px',
                minHeight: '96px'
            };
        } else if (rank === 2) {
            // Runner-up - Stronger silver with more contrast
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(250, 251, 252, 0.97) 0%, rgba(241, 245, 249, 0.94) 50%, rgba(220, 228, 238, 0.88) 100%)',
                border: '2px solid rgba(120, 140, 165, 0.35)',
                boxShadow: '0 8px 32px rgba(80, 100, 130, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.7) inset',
                borderRadius: '20px',
                minHeight: '92px'
            };
        } else if (rank === 3) {
            // Third Place - Cooler bronze with more neutral white
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, rgba(255, 253, 250, 0.96) 0%, rgba(250, 245, 240, 0.92) 50%, rgba(240, 228, 218, 0.85) 100%)',
                border: '2px solid rgba(150, 100, 60, 0.22)',
                boxShadow: '0 6px 24px rgba(120, 80, 40, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.55) inset',
                borderRadius: '20px',
                minHeight: '88px'
            };
        }

        return {
            ...baseStyle,
            background: isCurrentUser ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.06)'
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
                return 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/40';
            case 2:
                return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-lg shadow-slate-500/30';
            case 3:
                return 'bg-gradient-to-br from-orange-300 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25';
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
        <div className="pb-20 space-y-6">
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
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer animate-fade-in-up ${user.rank <= 3 ? getAnimationClass(user.rank) : ''
                                        } ${user.userId === currentUserRank?.userId && user.rank > 3
                                            ? 'ring-2 ring-violet-300'
                                            : ''
                                        }`}
                                    style={{
                                        ...getCardStyle(user.rank, user.userId === currentUserRank?.userId),
                                        animationDelay: `${index * 50}ms`
                                    }}
                                    onMouseEnter={(e) => {
                                        if (user.rank <= 3) {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        } else {
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
                                            e.currentTarget.style.transform = 'scale(1.01)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = getCardStyle(user.rank, user.userId === currentUserRank?.userId).boxShadow;
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {/* Rank Badge */}
                                    <div className={`flex-shrink-0 ${user.rank <= 3 ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl flex items-center justify-center font-bold text-lg ${getMedalStyle(user.rank)}`}>
                                        {getMedalEmoji(user.rank) || user.rank}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`truncate ${user.rank === 1
                                                ? 'text-lg font-bold text-amber-900'
                                                : user.rank <= 3
                                                    ? 'text-base font-bold text-gray-900'
                                                    : 'font-semibold text-gray-900'
                                                }`}>
                                                {user.name}
                                                {user.userId === currentUserRank?.userId && (
                                                    <span className="ml-2 text-xs text-violet-600 font-medium">(You)</span>
                                                )}
                                            </h3>
                                        </div>
                                        {/* Title Label for Top 3 */}
                                        {getTitleLabel(user.rank) && (
                                            <div className={`text-xs font-semibold mt-0.5 ${user.rank === 1
                                                ? 'text-amber-600'
                                                : user.rank === 2
                                                    ? 'text-slate-500'
                                                    : 'text-orange-600'
                                                }`}>
                                                {getTitleLabel(user.rank)}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                                            <span className={`px-2.5 py-0.5 rounded-full font-medium border ${getDepartmentColor(user.department)}`}>
                                                {user.department}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500">{user.year}</span>
                                        </div>
                                    </div>

                                    {/* Stats - Improved sizing */}
                                    <div className="flex items-center gap-5 text-sm">
                                        <div className="text-center min-w-[48px]">
                                            <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-base">
                                                <ChevronUpIcon className="w-4 h-4" strokeWidth={2.5} />
                                                {user.totalUpvotes}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">upvotes</div>
                                        </div>
                                        <div className="text-center hidden sm:block min-w-[48px]">
                                            <div className="flex items-center justify-center gap-1 text-violet-600 font-bold text-base">
                                                <ChatBubbleLeftIcon className="w-4 h-4" />
                                                {user.answerCount}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">answers</div>
                                        </div>
                                        <div className="text-center hidden sm:block min-w-[48px]">
                                            <div className="flex items-center justify-center gap-1 text-fuchsia-600 font-bold text-base">
                                                <DocumentTextIcon className="w-4 h-4" />
                                                {user.postCount}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">posts</div>
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
