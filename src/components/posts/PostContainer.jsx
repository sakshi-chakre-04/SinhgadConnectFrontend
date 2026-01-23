import React, { useCallback, useState } from 'react';
import CustomSelect from '../common/CustomSelect';
import {
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
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
  <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}>
    <div className="max-w-4xl mx-auto p-4">{children}</div>
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api'}/posts/${postId}/vote`, {
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
        {/* Skeleton Post Cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Compact Header with Inline Filters */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 flex-shrink-0">All Posts</h1>

          <div className="flex flex-1 gap-3 md:justify-end">
            <div className="w-full md:w-auto">
              <CustomSelect
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                options={DEPARTMENTS}
                icon={FunnelIcon}
                placeholder="Filter by Department"
              />
            </div>

            <div className="w-full md:w-auto">
              <CustomSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={SORT_OPTIONS}
                icon={ArrowsUpDownIcon}
                placeholder="Sort by"
              />
            </div>
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
