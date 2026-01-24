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
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139, 92, 246, 0.1)' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 animate-pulse border-b border-gray-200 last:border-b-0">
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
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
    </>
  );
};

export default PostsContainer;
