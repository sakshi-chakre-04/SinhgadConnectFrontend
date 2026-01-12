import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';
import PostsList from './PostsList';
import { usePosts } from './usePosts';

// Constants
const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'Computer', label: 'Computer' },
  { value: 'IT', label: 'IT' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Electrical', label: 'Electrical' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'upvotes', label: 'Most Upvoted' },
  { value: 'commentCount', label: 'Most Discussed' },
];

const SELECT_CLASS = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

// Reusable wrapper component
const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto">{children}</div>
  </div>
);

const PostsContainer = () => {
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

      setPosts((prev) => prev.map((p) => (p._id === postId ? data.post : p)));
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.message || 'Failed to process vote');
    }
  }, [token, setPosts]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="ml-4 text-gray-600">Loading posts...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={SELECT_CLASS}>
              {DEPARTMENTS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={SELECT_CLASS}>
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
        onSuccessRefresh={refetch}
      />
    </PageWrapper>
  );
};

export default PostsContainer;
