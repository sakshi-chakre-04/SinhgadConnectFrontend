import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api/api';

const UserProfile = () => {
    const { userId } = useParams();

    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalUpvotes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);

            // Fetch posts and comments in parallel
            const [postsRes, commentsRes] = await Promise.all([
                api.get(`/posts/user/${userId}`),
                api.get(`/comments/user/${userId}`)
            ]);

            // Get user info from first post or comment
            const firstPost = postsRes.data.posts?.[0];
            const firstComment = commentsRes.data.comments?.[0];
            const authorInfo = firstPost?.author || firstComment?.author;

            if (authorInfo) {
                setUserData(authorInfo);
            }

            setPosts(postsRes.data.posts || []);
            setComments(commentsRes.data.comments || []);
            setStats({
                totalPosts: postsRes.data.stats?.totalPosts || 0,
                totalComments: commentsRes.data.stats?.totalComments || 0,
                totalUpvotes: postsRes.data.stats?.totalUpvotes || 0
            });
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('User not found or failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                    {error || 'User not found'}
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'posts', label: 'Posts', count: stats.totalPosts },
        { id: 'comments', label: 'Comments', count: stats.totalComments }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'User'}</h1>
                        <p className="text-gray-500">{userData?.department} • Year {userData?.year}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{stats.totalPosts}</p>
                        <p className="text-gray-500 text-sm">Posts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.totalComments}</p>
                        <p className="text-gray-500 text-sm">Comments</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">{stats.totalUpvotes}</p>
                        <p className="text-gray-500 text-sm">Upvotes Received</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No posts yet</p>
                            ) : (
                                posts.map((post) => (
                                    <Link
                                        key={post._id}
                                        to={`/posts/${post._id}`}
                                        className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                                    >
                                        <h3 className="font-semibold text-gray-800 hover:text-indigo-600">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                            {post.summary || post.content?.substring(0, 100)}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span>⬆️ {post.upvoteCount || 0}</span>
                                            <span>💬 {post.commentCount || 0}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No comments yet</p>
                            ) : (
                                comments.map((comment) => (
                                    <Link
                                        key={comment._id}
                                        to={`/posts/${comment.post?._id || comment.post}`}
                                        className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                                    >
                                        <p className="text-gray-600">{comment.content}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                            <span>On: {comment.post?.title || 'Post'}</span>
                                            <span>•</span>
                                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
