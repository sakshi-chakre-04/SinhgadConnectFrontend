import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from '../hooks/useModal';
import { postsAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

// Validation functions
const validateQuestionTitle = (value) => {
  if (!value || value.trim() === '') return 'Question title is required';
  if (value.length < 10) return 'Title must be at least 10 characters';
  if (value.length > 200) return 'Title cannot exceed 200 characters';
  return true;
};

const validateQuestionDesc = (value) => {
  if (value && value.length > 2000) return 'Description cannot exceed 2000 characters';
  return true;
};

const validatePostContent = (value) => {
  if (!value || value.trim() === '') return 'Post content is required';
  if (value.length < 10) return 'Post must be at least 10 characters';
  if (value.length > 10000) return 'Post cannot exceed 10000 characters';
  return true;
};

const validateDepartment = (value) => {
  if (!value) return 'Please select a department';
  return true;
};

const ASKQues = ({ isOpen, onClose, onPostCreated, initialTab = 'Add Question' }) => {
  // Initialize isSubmittingPost state
  const [isSubmittingPost, setIsSubmittingPost] = React.useState(false);
  const { activeTab, closeModal } = useModal();
  const user = useSelector(selectCurrentUser);
  const [currentTab, setCurrentTab] = React.useState(initialTab || activeTab || 'Add Question');
  
  // Initialize forms
  const {
    register: registerQuestion,
    handleSubmit: handleQuestionSubmit,
    reset: resetQuestion,
    formState: { errors: questionErrors },
  } = useForm();

  const {
    register: registerPost,
    handleSubmit: handlePostSubmit,
    reset: resetPost,
    formState: { errors: postErrors },
  } = useForm();

  // Update current tab when activeTab from context changes or when modal opens
  useEffect(() => {
    if (isOpen && activeTab) {
      console.log('Active tab changed to:', activeTab);
      setCurrentTab(activeTab);
    }
  }, [activeTab, isOpen]);
  
  // Log when modal open state changes
  useEffect(() => {
    console.log('Modal open state changed:', isOpen);
    
    if (isOpen) {
      // Reset forms when opening the modal
      resetQuestion();
      resetPost();
    }
  }, [isOpen]);

  const handleClose = useCallback((shouldRefresh = false) => {
    console.log('Closing modal, shouldRefresh:', shouldRefresh);
    
    // Reset forms first
    resetQuestion();
    resetPost();
    
    // Reset the tab if we're refreshing
    if (shouldRefresh) {
      setCurrentTab('Add Question');
    }
    
    // Call the parent's onClose handler if provided, otherwise use closeModal
    if (onClose) {
      onClose(shouldRefresh);
    } else {
      closeModal({ shouldRefresh });
    }
  }, [onClose, closeModal, resetQuestion, resetPost, setCurrentTab]);

  const onSubmitQuestion = async (data) => {
    if (isSubmittingPost) return;
    
    try {
      setIsSubmittingPost(true);
      const postData = {
        title: data.title,
        content: data.description || `Question posted by ${user?.name}`,
        department: user?.department,
        type: 'question'
      };
      
      console.log('Submitting question:', postData);
      await postsAPI.createPost(postData);
      
      // Close modal and refresh content
      handleClose(true);
      
      // Show success toast could be added here
    } catch (error) {
      console.error('Error creating question:', error);
      setIsSubmittingPost(false); // Reset isSubmittingPost state on error
      throw error; // Re-throw to be caught by the form's error boundary
    } finally {
      setIsSubmittingPost(false); // Reset isSubmittingPost state on completion
    }
  };

  const onSubmitPost = async (formData) => {
    console.log('1. Form submitted with data:', formData);
    
    if (isSubmittingPost) {
      console.log('Already submitting, ignoring click');
      return;
    }
    
    try {
      console.log('2. Starting form submission');
      setIsSubmittingPost(true);
      
      // Validate form data
      if (!formData.content) {
        throw new Error('Post content is required');
      }
      
      const postData = {
        title: formData.content.substring(0, 100) + (formData.content.length > 100 ? '...' : ''),
        content: formData.content,
        department: user?.department || 'General',
        type: 'post'
      };
      
      console.log('3. Prepared post data:', postData);
      
      try {
        console.log('4. Calling postsAPI.createPost');
        const response = await postsAPI.createPost(postData);
        console.log('5. Post created successfully:', response);
        
        // Close modal and refresh content
        console.log('6. Closing modal');
        handleClose(true);
        
        // If there's a callback, call it
        if (onPostCreated && typeof onPostCreated === 'function') {
          console.log('7. Calling onPostCreated callback');
          onPostCreated(response);
        }
        
      } catch (apiError) {
        console.error('API Error:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          stack: apiError.stack
        });
        throw new Error(apiError.response?.data?.message || 'Failed to create post');
      }
      
    } catch (error) {
      console.error('Form submission failed:', {
        error: error.message,
        stack: error.stack
      });
      
      // Show error to user
      if (error.response?.data?.message) {
        // Handle API error with message
        return { 
          root: { 
            message: error.response.data.message 
          } 
        };
      }
      
      // Re-throw the error to be caught by react-hook-form
      throw error;
      
    } finally {
      console.log('8. Form submission completed');
      setIsSubmittingPost(false);
    }
  };

  // Don't render if not open
  if (!isOpen) {
    console.log('Modal is not open, not rendering');
    return null;
  }
  
  console.log('Rendering ASKQues modal with tab:', currentTab);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => setCurrentTab('Add Question')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                currentTab === 'Add Question' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('Create Post')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                currentTab === 'Create Post' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create Post
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {currentTab === 'Add Question' ? (
            <form onSubmit={handleQuestionSubmit(onSubmitQuestion)} className="space-y-4">
              {questionErrors.root && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                  {questionErrors.root.message}
                </div>
              )}
              
              <div>
                <label htmlFor="question-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title *
                </label>
                <input
                  id="question-title"
                  type="text"
                  {...registerQuestion('title', {
                    validate: validateQuestionTitle
                  })}
                  placeholder="What would you like to ask the SinhgadConnect community?"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    questionErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={questionErrors.title ? 'true' : 'false'}
                />
                {questionErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{questionErrors.title.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="question-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="question-description"
                  {...registerQuestion('description', {
                    validate: validateQuestionDesc
                  })}
                  placeholder="Add more details to help others understand your question better..."
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    questionErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={questionErrors.description ? 'true' : 'false'}
                />
                {questionErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{questionErrors.description.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t mt-6">
                <div className="text-sm text-gray-500">
                  Posting as: {user?.name} ({user?.department} - Year {user?.year})
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Post Question
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submit event triggered');
                handlePostSubmit(onSubmitPost)(e).catch(error => {
                  console.error('Form submission error:', error);
                });
              }} 
              className="space-y-4"
            >
              {postErrors.root && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                  {postErrors.root.message}
                </div>
              )}
              
              <div>
                <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind? *
                </label>
                <textarea
                  id="post-content"
                  {...registerPost('content', {
                    validate: validatePostContent
                  })}
                  placeholder="Share something with the SinhgadConnect community..."
                  rows={6}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    postErrors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={postErrors.content ? 'true' : 'false'}
                />
                {postErrors.content && (
                  <p className="mt-1 text-sm text-red-600">{postErrors.content.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t mt-6">
                <div className="text-sm text-gray-500">
                  Posting as: {user?.name} ({user?.department} - Year {user?.year})
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSubmittingPost 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isSubmittingPost ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </div>
                    ) : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ASKQues;
