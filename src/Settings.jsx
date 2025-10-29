import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';

const Settings = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">This section is coming soon!</p>
          <p className="mt-4 text-gray-500">We're working hard to bring you the best experience.</p>
          
          <div className="mt-8 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-indigo-600">
              <svg 
                className="mx-auto h-12 w-12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Under Development</h2>
            <p className="mt-2 text-gray-600">We're currently working on the settings page. Check back soon for updates!</p>
            
            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
