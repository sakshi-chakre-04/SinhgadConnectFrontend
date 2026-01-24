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
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api/api';

// Avatar gradient based on name - violet theme
const getAvatarGradient = (name) => {
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-purple-500 to-fuchsia-600',
    'from-fuchsia-500 to-pink-600',
    'from-indigo-500 to-violet-600',
    'from-violet-600 to-fuchsia-500'
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
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: '#8b5cf6' }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen px-4 pt-4"
        style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
      >
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'My Posts', count: stats.totalPosts, icon: DocumentTextIcon },
    { id: 'comments', label: 'My Comments', count: stats.totalComments, icon: ChatBubbleLeftIcon },
    { id: 'about', label: 'About', icon: AcademicCapIcon }
  ];

  return (
    <div
      className="min-h-screen pb-20 lg:pb-6"
      style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
    >
      {/* Profile Header Card with Gradient */}
      <div
        className="relative overflow-hidden rounded-b-3xl md:rounded-3xl mx-0 mt-0 md:mx-4 md:mt-4"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: '0 4px 30px rgba(139, 92, 246, 0.1)'
        }}
      >
        {/* Gradient Banner */}
        <div
          className="h-36 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full"></div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar - overlapping the banner */}
          <div
            className={`absolute -top-14 left-6 w-28 h-28 rounded-2xl bg-gradient-to-br ${getAvatarGradient(userData?.name)} flex items-center justify-center text-5xl font-bold text-white border-4 border-white`}
            style={{ boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)' }}
          >
            {userData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Edit & Sign Out Buttons - top right */}
          <div className="flex justify-end pt-4 gap-2">
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all font-medium text-sm"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-violet-600 rounded-xl transition-all font-medium text-sm bg-white/80 border border-violet-200 hover:bg-violet-50"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* User Info */}
          <div className="mt-10">
            <h1 className="text-2xl font-bold text-gray-900">{userData?.name || 'User'}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <EnvelopeIcon className="w-4 h-4 text-violet-500" />
                {userData?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-4 h-4 text-violet-500" />
                {userData?.department}
              </span>
              <span className="flex items-center gap-1.5">
                <AcademicCapIcon className="w-4 h-4 text-violet-500" />
                Year {userData?.year}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div
            className="grid grid-cols-3 gap-4 mt-6 p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.15)'
            }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">{stats.totalPosts}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Posts</p>
            </div>
            <div className="text-center border-x border-violet-200/50">
              <p className="text-2xl font-bold text-purple-600">{stats.totalComments}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Comments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-fuchsia-600">{stats.totalUpvotes}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Upvotes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div
        className="mx-4 mt-6 rounded-2xl overflow-hidden md:mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
        }}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-violet-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'border-b-2 border-violet-500 text-violet-600 bg-violet-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-violet-500' : ''}`} />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${activeTab === tab.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                    style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' } : {}}
                  >
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
                  <div
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)' }}
                  >
                    <DocumentTextIcon className="w-10 h-10 text-violet-400" />
                  </div>
                  <p className="text-gray-700 font-semibold">No posts yet</p>
                  <p className="text-sm text-gray-500 mt-1">Share your first question or discussion!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/posts/${post._id}`}
                    className="block p-5 rounded-xl transition-all group hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                      border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {post.summary || post.content?.substring(0, 100)}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-4 h-4 text-violet-400" />
                        {post.upvoteCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="w-4 h-4 text-purple-400" />
                        {post.commentCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4 text-fuchsia-400" />
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
                  <div
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)' }}
                  >
                    <ChatBubbleLeftIcon className="w-10 h-10 text-violet-400" />
                  </div>
                  <p className="text-gray-700 font-semibold">No comments yet</p>
                  <p className="text-sm text-gray-500 mt-1">Join a discussion and share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Link
                    key={comment._id}
                    to={`/posts/${comment.post?._id || comment.post}`}
                    className="block p-5 rounded-xl transition-all group hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                      border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <p className="text-gray-600">{comment.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>On: <span className="text-violet-600 font-medium">{comment.post?.title || 'Post'}</span></span>
                      <span className="text-violet-300">•</span>
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
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}
              >
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-violet-500" />
                  Bio
                </h3>
                <p className="text-gray-600">
                  {userData?.bio || 'No bio added yet. Tell others about yourself!'}
                </p>
              </div>

              {/* Skills & Interests */}
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-violet-500" />
                  Skills & Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(userData?.skills && userData.skills.length > 0) ? (
                    userData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                        }}
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
                          className="px-3 py-1.5 bg-white/70 text-gray-500 rounded-full text-sm border border-dashed border-violet-300"
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
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <p className="text-xs text-violet-600 font-medium mb-1">Email</p>
                  <p className="text-gray-800 font-medium">{userData?.email}</p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}
                >
                  <p className="text-xs text-purple-600 font-medium mb-1">Department</p>
                  <p className="text-gray-800 font-medium">{userData?.department}</p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.1) 0%, rgba(217, 70, 239, 0.05) 100%)',
                    border: '1px solid rgba(217, 70, 239, 0.2)'
                  }}
                >
                  <p className="text-xs text-fuchsia-600 font-medium mb-1">Year</p>
                  <p className="text-gray-800 font-medium">{userData?.year}</p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(192, 38, 211, 0.1) 0%, rgba(192, 38, 211, 0.05) 100%)',
                    border: '1px solid rgba(192, 38, 211, 0.2)'
                  }}
                >
                  <p className="text-xs text-fuchsia-700 font-medium mb-1">Member Since</p>
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
