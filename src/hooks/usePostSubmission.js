import { useState, useCallback } from 'react';
import { postsAPI } from '../services/api/postsService';

export const usePostSubmission = (user, onClose, onPostCreated) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = useCallback(async (postData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // postData already contains: title, content, department, postType
      const response = await postsAPI.createPost(postData);

      onClose(true);

      if (typeof onPostCreated === 'function') {
        onPostCreated(response);
      }

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onClose, onPostCreated]);

  return { isSubmitting, submitPost };
};
