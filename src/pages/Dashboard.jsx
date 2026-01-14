import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../hooks/useModal';
import { selectUser } from '../features/auth/authSlice';
import {
  PlusCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import PostContainer from '../components/posts/PostContainer';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { openModal } = useModal();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Futuristic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl hover-glow transition-all duration-500 group">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x"></div>

        {/* Glass Overlay Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium mb-3">
              <span className="animate-pulse mr-2">✨</span> Welcome to the future of learning
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-indigo-100 font-medium text-lg">
              {user?.department} • Year {user?.year}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-white/90 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30 group/btn"
            >
              <PlusCircleIcon className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
              Ask Question
            </button>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 hover:scale-105 transition-all shadow-lg"
            >
              <FireIcon className="w-5 h-5" />
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Feed Section - Increased top margin for separation */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-indigo-500" />
            Latest Discussions
          </h2>
          <button
            onClick={() => navigate('/posts')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
          >
            View all
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        <PostContainer />
      </div>
    </div>
  );
};

export default Dashboard;
