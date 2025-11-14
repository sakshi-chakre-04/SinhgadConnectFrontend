import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../features/auth/authSlice';
import PostsList from './PostsList';
import { usePosts } from './usePosts';

const PostsContainer = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showComments, setShowComments] = useState({});

  const { posts, setPosts, loading, error, refetch } = usePosts({ filter, sortBy });

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentCountUpdate = (postId, count) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, commentCount: count } : p)));
  };

  const handleVote = useCallback(async (postId, voteType) => {
    if (!token) {
      alert('Please log in to vote');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to process vote');

      if (data?.post) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? data.post : p)));
      } else {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id !== postId) return post;
            const updated = { ...post };
            const userId = user?._id;
            const up = new Set(updated.upvotes || []);
            const down = new Set(updated.downvotes || []);
            up.delete(userId);
            down.delete(userId);
            if (voteType === 'upvote' && post.userVote !== 1) {
              up.add(userId);
              updated.userVote = 1;
            } else if (voteType === 'downvote' && post.userVote !== -1) {
              down.add(userId);
              updated.userVote = -1;
            } else {
              updated.userVote = 0;
            }
            updated.upvotes = Array.from(up);
            updated.downvotes = Array.from(down);
            return updated;
          })
        );
      }
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.message || 'Failed to process vote');
    }
  }, [token, user?._id, setPosts]);

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
        <PostsList
          posts={posts}
          showComments={showComments}
          onToggleComments={toggleComments}
          onVote={handleVote}
          onCommentCountUpdate={handleCommentCountUpdate}
        />
      </div>
    </div>
  );
};

export default PostsContainer;
