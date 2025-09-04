import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentSection from './posts/CommentSection';

const Posts = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [expandedPost, setExpandedPost] = useState(null);
  const [showComments, setShowComments] = useState({});

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentCountUpdate = (postId, count) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, commentCount: count } 
          : post
      )
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        sortBy,
        sortOrder: 'desc',
        limit: '20'
      });
      
      if (filter !== 'all') {
        params.append('department', filter);
      }
      
      const response = await fetch(`http://localhost:5000/api/posts?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    if (!token) {
      alert('Please log in to vote');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process vote');
      }
      
      // Update the specific post's vote count without refreshing all posts
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const updatedPost = { ...post };
          
          // Remove previous vote if exists
          if (post.userVote === 1) {
            updatedPost.upvotes = post.upvotes.filter(id => id !== user?._id);
          } else if (post.userVote === -1) {
            updatedPost.downvotes = post.downvotes.filter(id => id !== user?._id);
          }
          
          // Add new vote
          if (voteType === 'upvote' && post.userVote !== 1) {
            updatedPost.upvotes = [...(updatedPost.upvotes || []), user?._id];
            updatedPost.userVote = 1;
          } else if (voteType === 'downvote' && post.userVote !== -1) {
            updatedPost.downvotes = [...(updatedPost.downvotes || []), user?._id];
            updatedPost.userVote = -1;
          } else {
            // If clicking the same vote button again, remove the vote
            updatedPost.userVote = 0;
          }
          
          return updatedPost;
        }
        return post;
      }));
      
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.message || 'Failed to process vote');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SinhgadConnect Posts</h1>
          <p className="text-gray-600">Discover what's happening in your college community</p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="Computer">Computer</option>
                <option value="IT">IT</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electronics">Electronics</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="createdAt">Latest</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="commentCount">Most Discussed</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
              <p className="text-gray-600">Be the first to share something with the community!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">{post.author?.name || 'Unknown User'}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.author?.department} - Year {post.author?.year}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {post.department}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      {/* Upvote */}
                      <button
                        onClick={() => handleVote(post._id, 'upvote')}
                        className={`flex items-center space-x-1 ${post.userVote === 1 ? 'text-green-500' : 'text-gray-500'}`}
                      >
                        <span>▲</span>
                        <span>{post.upvotes?.length || 0}</span>
                      </button>

                      {/* Downvote */}
                      <button
                        onClick={() => handleVote(post._id, 'downvote')}
                        className={`flex items-center space-x-1 ${post.userVote === -1 ? 'text-red-500' : 'text-gray-500'}`}
                      >
                        <span>▼</span>
                        <span>{post.downvotes?.length || 0}</span>
                      </button>

                      {/* Comments - Show loading state when comments are being loaded */}
                      <button 
                        onClick={() => toggleComments(post._id)}
                        disabled={loading}
                        className={`flex items-center space-x-1 ${showComments[post._id] ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span>💬</span>
                        <span>
                          {loading && showComments[post._id] ? (
                            'Loading...'
                          ) : (
                            `${post.commentCount || 0} Comment${post.commentCount !== 1 ? 's' : ''}`
                          )}
                        </span>
                      </button>
                      
                      {showComments[post._id] && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <CommentSection 
                            postId={post._id} 
                            onCommentCountUpdate={(count) => handleCommentCountUpdate(post._id, count)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Net Score */}
                    <div className="text-sm text-gray-500">
                      Score: {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
