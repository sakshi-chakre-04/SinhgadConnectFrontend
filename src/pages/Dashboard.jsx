import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../hooks/useModal';
import { selectUser } from '../features/auth/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { openModal } = useModal();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.name}! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully logged in to Sinhgad Connect.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
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
          <ActionCard
            onClick={() => navigate('/posts')}
            bgColor="hover:bg-indigo-50"
            iconColor="text-indigo-500"
            title="Recent Posts"
            description="View latest discussions"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              </svg>
            }
          />
          
          <ActionCard
            onClick={() => openModal('Create Post')}
            bgColor="hover:bg-green-50"
            iconColor="text-green-500"
            title="Create Post"
            description="Share with community"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            }
          />
          
          <ActionCard
            onClick={() => navigate(`/department/${encodeURIComponent(user.department)}`)}
            bgColor="hover:bg-orange-50"
            iconColor="text-orange-500"
            title="My Department"
            description={`${user.department} community`}
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
          />
          
          <ActionCard
            onClick={() => navigate('/notifications')}
            bgColor="hover:bg-red-50"
            iconColor="text-red-500"
            title="Notifications"
            description="Stay updated"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Action Card Component
const ActionCard = ({ onClick, icon, title, description, bgColor, iconColor }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 ${bgColor}`}
  >
    <div className={`mb-2 ${iconColor}`}>
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Dashboard;
