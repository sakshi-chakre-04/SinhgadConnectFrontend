import React, { useState, useEffect, useCallback } from 'react';
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
import FileUpload from './FileUpload';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ASKQues = ({ isOpen, onClose, onPostCreated }) => {
  const user = useSelector(selectUser);
  const [submitError, setSubmitError] = useState(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty }, watch } = useForm({
    defaultValues: {
      title: '',
      content: '',
      postType: DEFAULT_POST_TYPE,
      department: user?.department || 'General'
    }
  });

  const [attachments, setAttachments] = useState([]);

  const selectedType = watch('postType');

  const titleValue = watch('title') || '';
  const contentValue = watch('content') || '';

  // Handle modal close with discard confirmation
  const handleClose = useCallback((shouldRefresh = false) => {
    if (isDirty && !shouldRefresh) {
      setShowDiscardConfirm(true);
      return;
    }
    setSubmitError(null);
    setShowDiscardConfirm(false);
    onClose(shouldRefresh);
  }, [onClose, isDirty]);

  // Force close without confirmation
  const forceClose = useCallback(() => {
    setSubmitError(null);
    setShowDiscardConfirm(false);
    onClose(false);
  }, [onClose]);

  // Post submission hook
  const { isSubmitting, submitPost } = usePostSubmission(user, handleClose, onPostCreated);

  // Form submission handler
  const onSubmit = async (formData) => {
    try {
      setSubmitError(null);
      const postData = {
        ...buildPostData(formData, user),
        attachments
      };
      await submitPost(postData);
      setAttachments([]);
    } catch (error) {
      console.error('Error creating post:', error.message);
      setSubmitError(error.message);
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
      setAttachments([]);
    }
  }, [isOpen, reset, user?.department]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div
            className="rounded-2xl p-6 max-w-sm mx-4"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 25px 50px rgba(139, 92, 246, 0.25)'
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discard changes?</h3>
            <p className="text-gray-600 text-sm mb-5">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-violet-50 text-violet-700 rounded-xl hover:bg-violet-100 font-medium transition-colors"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={forceClose}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: '0 25px 50px rgba(139, 92, 246, 0.2), 0 0 100px rgba(217, 70, 239, 0.1)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 blur-2xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-fuchsia-400/30 blur-2xl rounded-full"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white drop-shadow-sm">Create New Post</h2>
          </div>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="relative z-10 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <ErrorAlert message={submitError || errors.root?.message} />

            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(POST_TYPES).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedType === value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/50'
                      }`}
                    style={selectedType === value ? { boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' } : {}}
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
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white transition-colors"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>

            {/* File Attachments */}
            <FileUpload onFilesUploaded={setAttachments} maxFiles={5} />

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
