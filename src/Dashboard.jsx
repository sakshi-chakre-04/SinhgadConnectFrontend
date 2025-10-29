import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from './hooks/useModal';
import { selectCurrentUser, selectIsAuthenticated } from './features/auth/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { openModal } = useModal();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}! 🎉</h2>
          <p className="text-gray-600 mb-6">You have successfully logged in to Sinhgad Connect.</p>
          
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">Email</p>
              <p className="text-gray-800 font-semibold">{user.email}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Department</p>
              <p className="text-gray-800 font-semibold">{user.department}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Year</p>
              <p className="text-gray-800 font-semibold">{user.year}</p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => navigate('/posts')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 hover:bg-indigo-50"
          >
            <div className="text-indigo-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Recent Posts</h3>
            <p className="text-sm text-gray-600">View latest discussions</p>
          </div>
          
          <div 
            onClick={() => openModal('Create Post')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 hover:bg-green-50"
          >
            <div className="text-green-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Create Post</h3>
            <p className="text-sm text-gray-600">Share with community</p>
          </div>
          
          <div 
            onClick={() => navigate(`/department/${encodeURIComponent(user.department)}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 hover:bg-orange-50"
          >
            <div className="text-orange-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">My Department</h3>
            <p className="text-sm text-gray-600">{user.department} community</p>
          </div>
          
          <div 
            onClick={() => navigate('/notifications')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 hover:bg-red-50"
          >
            <div className="text-red-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Notifications</h3>
            <p className="text-sm text-gray-600">Stay updated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;