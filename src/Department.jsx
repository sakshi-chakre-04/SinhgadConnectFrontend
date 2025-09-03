import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { postsAPI } from './services/api';

const Department = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDepartmentPosts = async () => {
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
    };

    fetchDepartmentPosts();
  }, [departmentName, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading {departmentName} Department...</h1>
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{departmentName} Department</h1>
          
          {error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No posts found in this department yet.</p>
              <button
                onClick={() => navigate('/create-post')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post._id} 
                  className="border-b border-gray-200 pb-4 mb-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-indigo-600">{post.title}</h2>
                  <p className="text-gray-600 mt-2">
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>Posted by {post.author?.name || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.commentCount > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Department;
