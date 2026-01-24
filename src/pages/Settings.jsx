import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import {
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className="min-h-screen pb-20 lg:pb-6"
      style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
    >
      {/* Hero Header */}
      <div
        className="relative overflow-hidden rounded-b-3xl md:rounded-3xl mx-0 mt-0 md:mx-4 md:mt-4 p-8 lg:p-10"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
        }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            >
              <Cog6ToothIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">Settings</h1>
              <p className="text-violet-100 text-sm">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Appearance Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
          }}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-violet-500" />
              Appearance
            </h2>

            {/* Theme Toggle */}
            <button
              onClick={handleToggle}
              className="flex items-center justify-between w-full px-4 py-4 rounded-xl transition-all hover:bg-violet-50/50"
              style={{ border: '1px solid rgba(139, 92, 246, 0.1)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {isDarkMode ? (
                    <MoonIcon className="w-6 h-6 text-white" />
                  ) : (
                    <SunIcon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Theme</div>
                  <div className="text-sm text-gray-500">
                    {isDarkMode ? 'Dark mode' : 'Light mode'}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className="relative w-14 h-7 rounded-full transition-colors duration-300"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                    : '#e5e7eb',
                  boxShadow: isDarkMode ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none'
                }}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
          }}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-violet-500" />
              Coming Soon
            </h2>
            <div className="space-y-3">
              {/* Account Settings */}
              <div
                className="flex items-center gap-4 px-4 py-4 rounded-xl opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                  }}
                >
                  <UserCircleIcon className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Account Settings</div>
                  <div className="text-sm text-gray-500">Manage your account preferences</div>
                </div>
              </div>

              {/* Notifications */}
              <div
                className="flex items-center gap-4 px-4 py-4 rounded-xl opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.1)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(217, 70, 239, 0.2) 100%)'
                  }}
                >
                  <BellIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Notifications</div>
                  <div className="text-sm text-gray-500">Configure notification preferences</div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div
                className="flex items-center gap-4 px-4 py-4 rounded-xl opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.05) 0%, rgba(192, 38, 211, 0.05) 100%)',
                  border: '1px solid rgba(217, 70, 239, 0.1)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.2) 0%, rgba(192, 38, 211, 0.2) 100%)'
                  }}
                >
                  <ShieldCheckIcon className="w-6 h-6 text-fuchsia-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Privacy & Security</div>
                  <div className="text-sm text-gray-500">Control your privacy settings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
