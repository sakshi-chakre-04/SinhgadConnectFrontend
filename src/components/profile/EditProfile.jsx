import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectToken, updateUserProfile } from '../../features/auth/authSlice';
import { usersAPI } from '../../services/api';
import { toast } from 'react-toastify';

// Departments and years for dropdowns
const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical', 'Other'];
const years = ['FE', 'SE', 'TE', 'BE'];

// Validation rules
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (!value.endsWith('@sinhgad.edu')) return 'Must be a sinhgad.edu email';
  return true;
};

const validateUsername = (value) => {
  if (!value) return 'Username is required';
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (value.length > 20) return 'Username must not exceed 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return true;
};

const EditProfile = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      year: user?.year || '',
      bio: user?.bio || ''
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    if (!user || !token) {
      toast.error('Please log in to update your profile');
      navigate('/login');
      return;
    }

    try {
      // Prepare the update data with only allowed fields
      const updateData = {
        name: data.name,
        department: data.department,
        year: data.year,
        bio: data.bio || '' // Ensure bio is always a string, even if empty
      };
      
      console.log('Sending update data:', updateData);

      // Show loading state
      const toastId = toast.loading('Updating profile...');

      // Update user profile using the usersAPI service
      const response = await usersAPI.updateUserProfile(updateData, token);
      
      // The backend returns { success: true, user: { ... } }
      if (!response.success) {
        throw new Error('Failed to update profile');
      }
      
      // Update user in Redux store using the async thunk
      await dispatch(updateUserProfile(response.user)).unwrap();

      // Show success message
      toast.update(toastId, {
        render: 'Profile updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      // Reset form with new values
      reset(response.user);

      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      setFormError('root', {
        type: 'manual',
        message: error.message || 'Failed to update profile. Please try again.',
      });
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please log in to view this page</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="opacity-90">Update your personal information and preferences</p>
        </div>

        {/* Error message */}
        {errors.root && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.root.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Full Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.name ? 'border-red-500' : 'border'
                      }`}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                {/* Department */}
                <div className="sm:col-span-3">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <div className="mt-1">
                    <select
                      id="department"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.department ? 'border-red-500' : 'border'
                      }`}
                      {...register('department', {
                        required: 'Department is required',
                      })}
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                    )}
                  </div>
                </div>

                {/* Year */}
                <div className="sm:col-span-3">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year *
                  </label>
                  <div className="mt-1">
                    <select
                      id="year"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.year ? 'border-red-500' : 'border'
                      }`}
                      {...register('year', {
                        required: 'Year is required',
                      })}
                    >
                      <option value="">Select year</option>
                      {years.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      rows={3}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md ${
                        errors.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('bio', {
                        maxLength: {
                          value: 500,
                          message: 'Bio cannot exceed 500 characters',
                        },
                      })}
                      placeholder="Tell us about yourself..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      A short introduction about yourself (max 500 characters)
                    </p>
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Update Section - Removed as requested */}
          </div>

          {/* Form Actions */}
          <div className="pt-5">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting || !isDirty
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
