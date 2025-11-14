import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../features/auth/authSlice';
import { PencilIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          setUserData(user);
          setLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        setError(err.message || 'Error loading profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserProfile();
    else navigate('/login');
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="sr-only">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 mb-4">
            {userData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'User'}</h1>
          <p className="text-gray-600">@{userData?.username || 'username'}</p>
          <p className="text-gray-500 mt-2 mb-4">
            {userData?.department} - Year {userData?.year}
          </p>
          <Link
            to="/edit-profile"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Edit Profile
          </Link>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {userData?.email}</p>
            <p><span className="font-medium">Department:</span> {userData?.department || 'Not specified'}</p>
            <p><span className="font-medium">Year:</span> {userData?.year || 'Not specified'}</p>
            <p><span className="font-medium">Member since:</span> {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Bio</h2>
          <p className="text-gray-600">
            {userData?.bio || 'No bio available. Add something about yourself!'}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/edit-profile"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
