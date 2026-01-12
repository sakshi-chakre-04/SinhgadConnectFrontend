import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { usePostSubmission } from '../../hooks/usePostSubmission';
import ErrorAlert from './ErrorAlert';
import FormField from './FormField';
import FormFooter from './FormFooter';
import {
  POST_TYPES,
  POST_TYPE_LABELS,
  DEPARTMENTS,
  DEFAULT_POST_TYPE,
  VALIDATION_RULES,
  buildPostData
} from './constants';

const ASKQues = ({ isOpen, onClose, onPostCreated }) => {
  const user = useSelector(selectUser);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      content: '',
      postType: DEFAULT_POST_TYPE,
      department: user?.department || 'General'
    }
  });

  const selectedType = watch('postType');

  // Handle modal close
  const handleClose = useCallback((shouldRefresh = false) => {
    onClose(shouldRefresh);
  }, [onClose]);

  // Post submission hook
  const { isSubmitting, submitPost } = usePostSubmission(user, handleClose, onPostCreated);

  // Form submission handler
  const onSubmit = async (formData) => {
    try {
      const postData = buildPostData(formData, user);
      await submitPost(postData);
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        content: '',
        postType: DEFAULT_POST_TYPE,
        department: user?.department || 'General'
      });
    }
  }, [isOpen, reset, user?.department]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="text-white hover:text-gray-200 text-2xl focus:outline-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <ErrorAlert message={errors.root?.message} />

            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(POST_TYPES).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedType === value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register('postType', VALIDATION_RULES.postType)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{POST_TYPE_LABELS[value]}</span>
                  </label>
                ))}
              </div>
              {errors.postType && (
                <p className="mt-1 text-sm text-red-500">{errors.postType.message}</p>
              )}
            </div>

            {/* Title */}
            <FormField
              id="title"
              label="Title"
              required
              error={errors.title}
              register={register}
              validation={VALIDATION_RULES.title}
              placeholder={
                selectedType === POST_TYPES.QUESTION
                  ? "What would you like to ask?"
                  : selectedType === POST_TYPES.ANNOUNCEMENT
                    ? "Announcement headline..."
                    : "Give your post a title..."
              }
            />

            {/* Content */}
            <FormField
              id="content"
              label="Content"
              type="textarea"
              required
              error={errors.content}
              register={register}
              validation={VALIDATION_RULES.content}
              placeholder={
                selectedType === POST_TYPES.QUESTION
                  ? "Add more details to help others understand your question..."
                  : selectedType === POST_TYPES.ANNOUNCEMENT
                    ? "Write your announcement details..."
                    : "Share your thoughts with the community..."
              }
              rows={5}
            />

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                {...register('department', VALIDATION_RULES.department)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>

            {/* Footer */}
            <FormFooter
              user={user}
              isSubmitting={isSubmitting}
              onCancel={() => handleClose(false)}
              submitText="Publish Post"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ASKQues;
