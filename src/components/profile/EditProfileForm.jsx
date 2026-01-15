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

        <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 ${isSubmitting || !isDirty
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditProfileForm;
