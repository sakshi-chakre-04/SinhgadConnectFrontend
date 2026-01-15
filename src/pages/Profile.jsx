import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectToken, logout } from '../features/auth/authSlice';
import {
  PencilIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api/api';

// Avatar gradient based on name
const getAvatarGradient = (name) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500'
  ];
  const index = name?.charCodeAt(0) % gradients.length || 0;
  return gradients[index];
};

const Profile = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalUpvotes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user) {
      setUserData(user);
      fetchUserData(user.id || user._id);
    }
  }, [token, user, navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const [postsRes, commentsRes] = await Promise.all([
        api.get(`/posts/user/${userId}`),
        api.get(`/comments/user/${userId}`)
      ]);

      setPosts(postsRes.data.posts || []);
      setComments(commentsRes.data.comments || []);
      setStats({
        totalPosts: postsRes.data.stats?.totalPosts || 0,
        totalComments: commentsRes.data.stats?.totalComments || 0,
        totalUpvotes: postsRes.data.stats?.totalUpvotes || 0
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'My Posts', count: stats.totalPosts, icon: DocumentTextIcon },
    { id: 'comments', label: 'My Comments', count: stats.totalComments, icon: ChatBubbleLeftIcon },
    { id: 'about', label: 'About', icon: AcademicCapIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Gradient Banner */}
        <div className={`h-32 bg-gradient-to-r ${getAvatarGradient(userData?.name)}`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar - overlapping the banner */}
          <div className={`absolute -top-12 left-6 w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarGradient(userData?.name)} flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white`}>
            {userData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Edit & Sign Out Buttons - top right */}
          <div className="flex justify-end pt-3 gap-2">
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* User Info */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900">{userData?.name || 'User'}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <EnvelopeIcon className="w-4 h-4" />
                {userData?.email}
              </span>
              <span className="flex items-center gap-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                {userData?.department}
              </span>
              <span className="flex items-center gap-1">
                <AcademicCapIcon className="w-4 h-4" />
                Year {userData?.year}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.totalPosts}</p>
              <p className="text-xs text-gray-500 font-medium">Posts</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-bold text-green-600">{stats.totalComments}</p>
              <p className="text-xs text-gray-500 font-medium">Comments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.totalUpvotes}</p>
              <p className="text-xs text-gray-500 font-medium">Upvotes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* My Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No posts yet</p>
                  <p className="text-sm text-gray-400 mt-1">Share your first question or discussion!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/posts/${post._id}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                  >
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {post.summary || post.content?.substring(0, 100)}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-4 h-4" />
                        {post.upvoteCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        {post.commentCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* My Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleLeftIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Join a discussion and share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Link
                    key={comment._id}
                    to={`/posts/${comment.post?._id || comment.post}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                  >
                    <p className="text-gray-600">{comment.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>On: <span className="text-gray-600">{comment.post?.title || 'Post'}</span></span>
                      <span>•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-600">
                  {userData?.bio || 'No bio added yet. Tell others about yourself!'}
                </p>
              </div>

              {/* Skills & Interests */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">Skills & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {(userData?.skills && userData.skills.length > 0) ? (
                    userData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <>
                      {/* Default display skills based on department */}
                      {['React', 'JavaScript', 'Python', 'DSA', 'Web Dev'].map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-white/70 text-gray-500 rounded-full text-sm border border-dashed border-gray-300"
                        >
                          + {skill}
                        </span>
                      ))}
                      <p className="w-full text-xs text-gray-500 mt-2">
                        Add your skills in Edit Profile to help others find you!
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Email</p>
                  <p className="text-gray-800 font-medium">{userData?.email}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-medium mb-1">Department</p>
                  <p className="text-gray-800 font-medium">{userData?.department}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-xs text-green-600 font-medium mb-1">Year</p>
                  <p className="text-gray-800 font-medium">{userData?.year}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-xs text-orange-600 font-medium mb-1">Member Since</p>
                  <p className="text-gray-800 font-medium">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
