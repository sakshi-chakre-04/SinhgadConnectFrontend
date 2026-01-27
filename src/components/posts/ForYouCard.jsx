import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../services/api/postsService';
import {
    SparklesIcon,
    ArrowRightIcon,
    ClockIcon,
    ChatBubbleLeftIcon,
    ArrowUpIcon,
    DocumentTextIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

/**
 * ForYouCard - Personalized Discovery Component (Mixed Resources + Posts)
 * 
 * Shows 1 academic resource + 2 interest-based posts
 * 
 * Futuristic Design Principles:
 * - Glassmorphism: Frosted glass effect with backdrop blur (Vision Pro inspired)
 * - Depth Layers: Multiple z-index layers creating spatial hierarchy
 * - Micro-animations: Smooth hover states and entrance animations (Linear/Raycast)
 * - Glow Effects: Soft luminescent borders (Nothing OS inspired)
 * - Gradient Overlays: Dynamic color transitions for visual interest
 */

// Academic resources data - matches Resources.jsx structure
const getResourceForUser = (department, year) => {
    const resourceMap = {
        Computer: {
            FE: { title: 'Engineering Mathematics-I Notes', subject: 'Engineering Mathematics-I', url: '/resources' },
            SE: { title: 'Data Structures Complete Guide', subject: 'Data Structures', url: '/resources' },
            TE: { title: 'DBMS Study Material', subject: 'Database Management Systems', url: '/resources' },
            BE: { title: 'Machine Learning Resources', subject: 'Machine Learning', url: '/resources' }
        },
        IT: {
            FE: { title: 'Engineering Physics Notes', subject: 'Engineering Physics', url: '/resources' },
            SE: { title: 'Web Technology Guide', subject: 'Web Technology', url: '/resources' },
            TE: { title: 'Operating Systems Notes', subject: 'Operating Systems', url: '/resources' },
            BE: { title: 'Cloud Computing Resources', subject: 'Cloud Computing', url: '/resources' }
        },
        Electronics: {
            FE: { title: 'Basic Electrical Engineering', subject: 'Basic Electrical Engineering', url: '/resources' },
            SE: { title: 'Digital Electronics Guide', subject: 'Digital Electronics', url: '/resources' },
            TE: { title: 'Microprocessors Study Material', subject: 'Microprocessors', url: '/resources' },
            BE: { title: 'Wireless Communication Notes', subject: 'Wireless Communication', url: '/resources' }
        },
        Mechanical: {
            FE: { title: 'Engineering Mechanics Notes', subject: 'Engineering Mechanics', url: '/resources' },
            SE: { title: 'Thermodynamics Guide', subject: 'Thermodynamics', url: '/resources' },
            TE: { title: 'Heat Transfer Study Material', subject: 'Heat Transfer', url: '/resources' },
            BE: { title: 'Automobile Engineering Resources', subject: 'Automobile Engineering', url: '/resources' }
        },
        Civil: {
            FE: { title: 'Engineering Chemistry Notes', subject: 'Engineering Chemistry', url: '/resources' },
            SE: { title: 'Surveying Complete Guide', subject: 'Surveying', url: '/resources' },
            TE: { title: 'Structural Analysis Notes', subject: 'Structural Analysis', url: '/resources' },
            BE: { title: 'Construction Management Resources', subject: 'Construction Management', url: '/resources' }
        },
        Electrical: {
            FE: { title: 'Basic Electrical Engineering', subject: 'Basic Electrical Engineering', url: '/resources' },
            SE: { title: 'Circuit Theory Guide', subject: 'Circuit Theory', url: '/resources' },
            TE: { title: 'Power Systems Study Material', subject: 'Power Systems', url: '/resources' },
            BE: { title: 'Smart Grid Resources', subject: 'Smart Grid', url: '/resources' }
        }
    };

    return resourceMap[department]?.[year] || null;
};

const ForYouCard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personalizationInfo, setPersonalizationInfo] = useState(null);
    const [recommendedResource, setRecommendedResource] = useState(null);

    useEffect(() => {
        fetchPersonalizedPosts();
    }, []);

    const fetchPersonalizedPosts = async () => {
        try {
            setLoading(true);
            const response = await postsAPI.getPersonalizedPosts();
            setPosts(response.posts || []);
            setPersonalizationInfo(response.personalizationInfo);

            // Get recommended resource for user's department/year
            if (response.personalizationInfo) {
                const resource = getResourceForUser(
                    response.personalizationInfo.department,
                    response.personalizationInfo.year
                );
                setRecommendedResource(resource);
            }
        } catch (error) {
            console.error('Failed to fetch personalized posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval}${unit[0]}`;
            }
        }
        return 'now';
    };

    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-3xl p-8 mx-3 md:mx-4 mb-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(217, 70, 239, 0.03) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
            >
                {/* Animated shimmer effect - Nothing OS inspired loading state */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)'
                    }}
                />
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-violet-100/50 rounded-lg animate-pulse" />
                    <div className="h-24 bg-violet-100/30 rounded-xl animate-pulse" />
                    <div className="h-20 bg-violet-100/30 rounded-xl animate-pulse" />
                    <div className="h-20 bg-violet-100/30 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if ((!posts || posts.length === 0) && !recommendedResource) {
        return (
            <div className="relative overflow-hidden rounded-3xl p-8 mx-3 md:mx-4 mb-6 group"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04) 0%, rgba(217, 70, 239, 0.04) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                }}
            >
                {/* Subtle ambient glow - Vision Pro depth effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05), transparent 70%)'
                    }}
                />

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                            boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)'
                        }}
                    >
                        <SparklesIcon className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Start Your Journey</h3>
                    <p className="text-sm text-gray-500">
                        Upvote posts you find interesting to get personalized recommendations
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-3xl mx-3 md:mx-4 mb-6 group"
            style={{
                // Glassmorphism - frosted glass effect (Vision Pro)
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                // Luminescent border - soft glow (Nothing OS)
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(217, 70, 239, 0.4))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                // Elevated shadow for depth (Raycast)
                boxShadow: `
          0 0 0 1px rgba(139, 92, 246, 0.05),
          0 8px 32px rgba(139, 92, 246, 0.12),
          0 16px 64px rgba(217, 70, 239, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8)
        `
            }}
        >
            {/* Ambient background gradient - creates depth */}
            <div className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.08), transparent 50%)'
                }}
            />

            {/* Animated gradient orbs - Vision Pro floating elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl animate-pulse"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%)',
                    animationDuration: '4s'
                }}
            />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-30 blur-3xl animate-pulse"
                style={{
                    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.3), transparent 70%)',
                    animationDuration: '5s',
                    animationDelay: '1s'
                }}
            />

            <div className="relative z-10 p-6">
                {/* Header with personalization indicator */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        {/* Icon with glow effect */}
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl blur-md"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(217, 70, 239, 0.4))'
                                }}
                            />
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}
                            >
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                👀 For You
                            </h2>
                            {personalizationInfo && (
                                <p className="text-xs text-violet-600 font-medium mt-0.5">
                                    {personalizationInfo.department} • Year {personalizationInfo.year}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* View all button with hover glow */}
                    <button
                        onClick={() => navigate('/posts')}
                        className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm text-violet-700 transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.08))',
                            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)'
                        }}
                    >
                        View all
                        <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Mixed content: Posts first, then Resource */}
                <div className="space-y-3">
                    {/* Posts Section - Shown First */}
                    {posts && posts.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-fuchsia-600 mb-2 flex items-center gap-1.5 px-1">
                                <SparklesIcon className="w-3.5 h-3.5" />
                                ⭐ Based on your interests
                            </h3>
                            {posts.map((post, index) => (
                                <div
                                    key={post._id}
                                    onClick={() => navigate(`/posts/${post._id}`)}
                                    className="group/post relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] mb-3"
                                    style={{
                                        // Nested glassmorphism - layered depth (Vision Pro)
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(139, 92, 246, 0.15)',
                                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.06)',
                                        // Staggered entrance animation (Linear)
                                        animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover/post:opacity-100 transition-opacity duration-500 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(217, 70, 239, 0.05))',
                                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                                        }}
                                    />

                                    <div className="relative z-10">
                                        {/* Match reason badge - floating pill (Raycast) */}
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                                            style={{
                                                background: post.matchReason === 'department'
                                                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15))'
                                                    : 'linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(236, 72, 153, 0.15))',
                                                color: post.matchReason === 'department' ? '#7c3aed' : '#c026d3',
                                                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
                                                border: '1px solid rgba(139, 92, 246, 0.2)'
                                            }}
                                        >
                                            {post.matchLabel}
                                        </div>

                                        {/* Post title with gradient on hover */}
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover/post:bg-gradient-to-r group-hover/post:from-violet-700 group-hover/post:to-fuchsia-700 group-hover/post:bg-clip-text group-hover/post:text-transparent transition-all duration-300">
                                            {post.title}
                                        </h3>

                                        {/* Meta information with icons */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="font-medium text-violet-600">
                                                {post.author?.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-3.5 h-3.5" />
                                                {formatTimeAgo(post.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ArrowUpIcon className="w-3.5 h-3.5 text-green-500" />
                                                {post.upvoteCount || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                                                {post.commentCount || 0}
                                            </span>
                                        </div>

                                        {/* Matching tags (for interest-based) */}
                                        {post.matchingTags && post.matchingTags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {post.matchingTags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded-md text-xs font-medium"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                                                            color: '#7c3aed',
                                                            border: '1px solid rgba(139, 92, 246, 0.2)'
                                                        }}
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Shine effect on hover (Nothing OS) */}
                                    <div className="absolute inset-0 opacity-0 group-hover/post:opacity-100 transition-opacity duration-700 pointer-events-none"
                                        style={{
                                            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                            transform: 'translateX(-100%)',
                                            animation: 'shine 2s infinite'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Resource Section - Shown Last */}
                    {recommendedResource && (
                        <div>
                            <h3 className="text-xs font-bold text-violet-600 mb-2 flex items-center gap-1.5 px-1 mt-4">
                                <BookOpenIcon className="w-3.5 h-3.5" />
                                📚 Resources for {personalizationInfo?.department} Year {personalizationInfo?.year}
                            </h3>
                            <div
                                onClick={() => navigate(recommendedResource.url)}
                                className="group/resource relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(34, 197, 94, 0.25)',
                                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.08)',
                                    animation: 'slideInUp 0.5s ease-out 0.2s both' // Delayed after posts
                                }}
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 opacity-0 group-hover/resource:opacity-100 transition-opacity duration-500 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))',
                                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                                    }}
                                />

                                <div className="relative z-10 flex items-center gap-4">
                                    {/* Resource icon */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: 'linear-gradient(135deg, #22c55e, #10b981)',
                                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                        }}
                                    >
                                        <DocumentTextIcon className="w-6 h-6 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 mb-0.5 group-hover/resource:text-green-600 transition-colors">
                                            {recommendedResource.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {recommendedResource.subject}
                                        </p>
                                    </div>

                                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover/resource:text-green-500 shrink-0 transition-colors" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom gradient fade - depth indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)'
                }}
            />
        </div>
    );
};

export default ForYouCard;
