// CommentForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { validateComment } from './utils/dateFormatter';

const CommentForm = ({ onSubmit, user, isSubmitting }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { content: '' }
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  if (!user) {
    return <div className="py-4 text-gray-500 text-center">Please log in to comment</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-8">
      <div className="flex gap-4 items-start bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <div className="flex-1">
          <textarea
            {...register('content', { validate: validateComment })}
            placeholder="Write a helpful comment..."
            rows={2}
            className={`w-full bg-transparent border-0 p-0 text-gray-700 placeholder-gray-400 focus:ring-0 resize-none leading-relaxed ${errors.content ? 'placeholder-red-300' : ''
              }`}
            aria-invalid={errors.content ? 'true' : 'false'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(handleFormSubmit)();
              }
            }}
          />
          {errors.content && <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500"></span>
            {errors.content.message}
          </p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
  isSubmitting: PropTypes.bool
};

export default CommentForm;
