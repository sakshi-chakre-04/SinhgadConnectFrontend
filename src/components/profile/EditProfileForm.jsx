import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectUser, selectToken, updateUserProfile } from '../../features/auth/authSlice';
import InputField from './InputField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import ErrorAlert from './ErrorAlert';

const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical', 'Other'];
const years = ['FE', 'SE', 'TE', 'BE'];

const EditProfileForm = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      year: user?.year || '',
      bio: user?.bio || '',
    },
  });

  const { handleSubmit, setError, formState: { isSubmitting, isDirty }, reset } = methods;

  useEffect(() => {
    reset({
      name: user?.name || '',
      department: user?.department || '',
      year: user?.year || '',
      bio: user?.bio || '',
    });
  }, [user, reset]);

  if (!user || !token) {
    return (
      <div className="p-6">
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

  const onSubmit = async (data) => {
    try {
      const toastId = toast.loading('Updating profile...');
      await dispatch(updateUserProfile(data)).unwrap();
      toast.update(toastId, {
        render: 'Profile updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (error) {
      setError('root', { type: 'manual', message: error || 'Failed to update profile. Please try again.' });
      toast.error(error || 'Failed to update profile');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <ErrorAlert />

        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField name="name" label="Full Name *" rules={{ required: 'Name is required' }} />
            </div>

            <div className="sm:col-span-3">
              <SelectField
                name="department"
                label="Department *"
                options={departments}
                placeholder="Select department"
                rules={{ required: 'Department is required' }}
              />
            </div>

            <div className="sm:col-span-3">
              <SelectField
                name="year"
                label="Year *"
                options={years}
                placeholder="Select year"
                rules={{ required: 'Year is required' }}
              />
            </div>

            <div className="sm:col-span-6">
              <TextareaField
                name="bio"
                label="Bio"
                rows={3}
                placeholder="Tell us about yourself..."
                rules={{ maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' } }}
                hint="A short introduction (max 500 characters)"
              />
            </div>
          </div>
        </div>

        <div className="pt-5 flex justify-end space-x-3">
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
      </form>
    </FormProvider>
  );
};

export default EditProfileForm;
