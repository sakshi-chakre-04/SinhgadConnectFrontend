import React from 'react';
import EditProfileForm from '../components/profile/EditProfileForm';

const EditProfile = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 mb-20 pt-8">
      <div className="glass-panel overflow-hidden border border-white/50 animate-fadeIn relative">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Edit Profile</h1>
            <p className="text-indigo-100 font-medium text-lg">Update your personal information</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-900/20 rounded-full blur-2xl"></div>
        </div>
        <EditProfileForm />
      </div>
    </div>
  );
};

export default EditProfile;
