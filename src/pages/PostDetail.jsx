import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';
import CommentSection from '../components/comments/CommentSection';
import { api } from '../services/api/api';

const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

const PostDetail = () => {
    const { id } = useParams();
    const token = useSelector(selectToken);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/posts/${id}`);
                setPost(response.data.post);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.response?.data?.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleVote = useCallback(async (voteType) => {
        if (!token) {
            alert('Please log in to vote');
            return;
        }
        try {
            const response = await api.post(`/posts/${id}/vote`, { voteType });
            setPost(response.data.post);
        } catch (err) {
            console.error('Error voting:', err);
            alert(err.response?.data?.message || 'Failed to vote');
        }
    }, [token, id]);

    const handleCommentCountUpdate = (count) => {
        setPost(prev => ({ ...prev, commentCount: count }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        <p className="ml-4 text-gray-600">Loading post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🗑️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {error === 'Post not found' ? 'Post Deleted' : 'Post Not Found'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error === 'Post not found'
                                ? 'This post has been deleted by its author.'
                                : error || 'The post you\'re looking for doesn\'t exist.'}
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back link */}
                <Link to="/posts" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to posts
                </Link>

                {/* Post Card */}
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-gray-800 text-lg">{post.author?.name || 'Unknown User'}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>{post.author?.department} - Year {post.author?.year}</span>
                                        <span className="mx-2">•</span>
                                        <span>{formatRelativeDate(post.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {post.department}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => handleVote('upvote')}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${post.userVote === 1
                                        ? 'bg-green-100 text-green-600'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">▲</span>
                                    <span className="font-medium">{post.upvotes?.length || post.upvoteCount || 0}</span>
                                </button>

                                <button
                                    onClick={() => handleVote('downvote')}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${post.userVote === -1
                                        ? 'bg-red-100 text-red-600'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">▼</span>
                                    <span className="font-medium">{post.downvotes?.length || post.downvoteCount || 0}</span>
                                </button>

                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${showComments ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">💬</span>
                                    <span className="font-medium">
                                        {post.commentCount || 0} Comment{post.commentCount !== 1 ? 's' : ''}
                                    </span>
                                </button>
                            </div>

                            <div className="text-sm text-gray-500 font-medium">
                                Score: {(post.upvotes?.length || post.upvoteCount || 0) - (post.downvotes?.length || post.downvoteCount || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
                            <CommentSection
                                postId={post._id}
                                onCommentCountUpdate={handleCommentCountUpdate}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
