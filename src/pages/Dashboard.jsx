import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../hooks/useModal';
import { selectUser } from '../features/auth/authSlice';
import {
  PlusCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  FireIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import PostContainer from '../components/posts/PostContainer';

const WELCOME_DISMISSED_KEY = 'sinhgad_welcome_dismissed';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { openModal } = useModal();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user has dismissed welcome before
    const dismissed = localStorage.getItem(WELCOME_DISMISSED_KEY);
    if (!dismissed) {
      setShowWelcome(true);
    }
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    setShowWelcome(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4">
      {/* Welcome Hero - Only for first-time users */}
      {showWelcome && (
        <div className="relative overflow-hidden rounded-2xl p-4 text-white shadow-2xl transition-all duration-500 group animate-fadeIn"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
            boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
          }}
        >
          {/* Dismiss button */}
          <button
            onClick={dismissWelcome}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
            title="Don't show again"
          >
            <XMarkIcon className="w-4 h-4 text-white" />
          </button>

          {/* Background Effects */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-2">
                <SparklesIcon className="w-3 h-3 mr-1.5" />
                Welcome to SinhgadConnect!
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-0.5 drop-shadow-lg">
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-violet-100 font-medium text-sm">
                Ask questions, share experiences, help your peers succeed
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              <button
                onClick={() => { openModal(); dismissWelcome(); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-700 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-sm"
                style={{ boxShadow: '0 4px 15px rgba(255,255,255,0.3)' }}
              >
                <PlusCircleIcon className="w-5 h-5" />
                Ask Your First Question
              </button>
              <button
                onClick={() => { navigate('/leaderboard'); dismissWelcome(); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all text-sm"
              >
                <FireIcon className="w-5 h-5" />
                Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Section - Mobile only */}
      <div className="relative w-full px-4 md:px-0 lg:hidden">
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
              boxShadow: '0 0 0 1px rgba(255,255,255,0.5), 0 4px 20px rgba(139, 92, 246, 0.12)'
            }}
          >
            <div className="pl-5">
              <MagnifyingGlassIcon className="w-5 h-5 text-violet-400" />
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

      {/* Posts Feed */}
      <div>
        <PostContainer />
      </div>
    </div>
  );
};

export default Dashboard;
