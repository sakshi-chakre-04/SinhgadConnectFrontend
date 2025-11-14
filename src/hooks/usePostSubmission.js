import { useState, useCallback } from 'react';
import { postsAPI } from '../services/api/postsService';
import { POST_TYPES, buildPostData } from '../components/ASKQues/constants';

export const usePostSubmission = (user, onClose, onPostCreated) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = useCallback(async (formData, postType) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const postData = buildPostData(formData, postType, user);
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
  }, [isSubmitting, user, onClose, onPostCreated]);

  return { isSubmitting, submitPost };
};
