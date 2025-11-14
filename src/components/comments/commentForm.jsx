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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            {...register('content', { validate: validateComment })}
            placeholder="Write a comment..."
            rows={3}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
              errors.content ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-500'
            }`}
            aria-invalid={errors.content ? 'true' : 'false'}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-fit px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
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
