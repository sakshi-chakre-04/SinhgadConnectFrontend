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
    <div className="space-y-6">
      {/* Futuristic Hero Section - Compact Version */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl hover-glow transition-all duration-500 group">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #607BE7 20%, #7666EC 40%, #8651F1 60%, #A23CF4 80%, #B82FF8 90%, #CD13FC 100%)' }}></div>

        {/* Glass Overlay Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium mb-2">
              <span className="animate-pulse mr-2">✨</span> Welcome to the future of learning
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-indigo-100 font-medium text-base">
              {user?.department} • Year {user?.year}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-1">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg group/btn text-sm"
              style={{ backgroundColor: '#CD13FC' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#A23CF4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#CD13FC'}
            >
              <PlusCircleIcon className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
              Ask Question
            </button>
            <button
              onClick={() => navigate('/trending')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg text-sm"
              style={{ backgroundColor: '#607BE7', borderColor: '#4A90E2' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7666EC'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#607BE7'}
            >
              <FireIcon className="w-5 h-5" />
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Feed Section - Increased top margin for separation */}
      <div className="pt-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
      </div>

      {/* Search Bar Section */}
      <div className="relative w-full mb-6 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.search.value;
            if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
          }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-white/90 backdrop-blur-xl border rounded-2xl shadow-lg p-2 transition-all duration-300 focus-within:scale-[1.01]" style={{ borderColor: '#7666EC' }}>
            <div className="pl-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search specific placement topics like 'TCS', 'Interview Tip'..."
              className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 text-lg py-3 px-4"
            />
            <button type="submit" className="text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg" style={{ backgroundColor: '#8651F1' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" style={{ color: '#8651F1' }} />
            Latest Discussions
          </h2>
          <button
            onClick={() => navigate('/posts')}
            className="font-medium text-sm flex items-center gap-1"
            style={{ color: '#8651F1' }}
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
