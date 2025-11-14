import React from 'react';
import EditProfileForm from '../components/profile/EditProfileForm';

const EditProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="opacity-90">Update your personal information</p>
        </div>
        <EditProfileForm />
      </div>
    </div>
  );
};

export default EditProfile;
