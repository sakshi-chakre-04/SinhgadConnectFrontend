import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { postsAPI } from '../services/api/postsService';
import { selectIsAuthenticated, selectToken } from '../features/auth/authSlice';
import PostsList from '../components/posts/PostsList';

const Department = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState({});

  const fetchDepartmentPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getDepartmentPosts(departmentName);
      setPosts(response.posts || []);
    } catch (err) {
      console.error('Error fetching department posts:', err);
      setError('Failed to load department posts');
    } finally {
      setLoading(false);
    }
  }, [departmentName]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDepartmentPosts();
  }, [departmentName, isAuthenticated, navigate, fetchDepartmentPosts]);

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
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-4 text-gray-600">Loading {departmentName} posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={fetchDepartmentPosts}
              className="ml-4 underline hover:no-underline"
            >
              Try Again
            </button>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{departmentName} Department</h1>
          <p className="text-gray-600">Posts from the {departmentName} community</p>
        </div>

        {/* Posts List - Same component as main posts page */}
        <PostsList
          posts={posts}
          showComments={showComments}
          onToggleComments={toggleComments}
          onVote={handleVote}
          onCommentCountUpdate={handleCommentCountUpdate}
          onSuccessRefresh={fetchDepartmentPosts}
        />
      </div>
    </div>
  );
};

export default Department;
