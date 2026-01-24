import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../hooks/useModal';
import { selectUser } from '../features/auth/authSlice';
import {
  PlusCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  FireIcon,
  MagnifyingGlassIcon
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
    <div className="space-y-6">
      {/* Futuristic Hero Section */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl transition-all duration-500 group mx-3 md:mx-4"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
        }}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div>
            {/* Animated Welcome Pill */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-3 animate-pulse">
              <SparklesIcon className="w-3.5 h-3.5 mr-2" />
              Welcome to the future of learning
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 drop-shadow-lg">
              {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-violet-100 font-medium text-base">
              {user?.department} • Year {user?.year}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-sm group/btn"
              style={{ boxShadow: '0 4px 15px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)' }}
            >
              <PlusCircleIcon className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
              Ask Question
            </button>
            <button
              onClick={() => navigate('/trending')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 transition-all text-sm"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            >
              <FireIcon className="w-5 h-5" />
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Search Section - Matching AI Page Style */}
      <div className="relative w-full px-4 md:px-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.search.value;
            if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <div
            className="relative flex items-center bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
            style={{
              border: '2px solid rgba(139, 92, 246, 0.25)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.5), 0 4px 20px rgba(139, 92, 246, 0.12), 0 8px 40px rgba(217, 70, 239, 0.08), 0 0 60px rgba(139, 92, 246, 0.05)'
            }}
          >
            <div className="pl-5">
              <MagnifyingGlassIcon className="w-5 h-5 text-violet-400" style={{ filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.4))' }} />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search placements, interviews, tips..."
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 text-base py-4 px-4"
            />
            <button
              type="submit"
              className="mr-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Latest Discussions */}
      <div>
        <div className="flex items-center justify-between mb-4 px-4 md:px-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-violet-500" />
            Latest Discussions
          </h2>
          <button
            onClick={() => navigate('/posts')}
            className="font-medium text-sm flex items-center gap-1 text-violet-600 hover:text-violet-700 transition-colors"
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
