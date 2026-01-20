import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { ArrowLeftIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>

            {/* Theme Toggle */}
            <button
              onClick={handleToggle}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  {isDarkMode ? (
                    <MoonIcon className="w-5 h-5 text-white" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Theme</div>
                  <div className="text-sm text-gray-500">
                    {isDarkMode ? 'Dark mode' : 'Light mode'}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
                }`}>
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
                  }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <div className="space-y-3 opacity-50">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div>
                  <div className="font-medium text-gray-900">Account Settings</div>
                  <div className="text-sm text-gray-500">Manage your account preferences</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div>
                  <div className="font-medium text-gray-900">Notifications</div>
                  <div className="text-sm text-gray-500">Configure notification preferences</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div>
                  <div className="font-medium text-gray-900">Privacy & Security</div>
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
