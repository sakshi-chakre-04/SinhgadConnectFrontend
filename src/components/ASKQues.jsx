import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { postsAPI } from '../services/api';

const ASKQues = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'Add Question');
  const { activeTab: contextTab } = useModal();

  useEffect(() => {
    if (isOpen && contextTab) {
      setActiveTab(contextTab);
    }
  }, [isOpen, contextTab]);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();

  const handleClose = () => {
    onClose();
    setQuestionTitle('');
    setQuestionDescription('');
    setPostContent('');
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!questionTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        title: questionTitle,
        content: questionDescription || 'Question posted by ' + user?.name,
        department: user?.department,
        type: 'question'
      };
      
      console.log('Submitting question:', postData);
      const response = await postsAPI.createPost(postData);
      console.log('Question submitted successfully:', response);
      
      handleClose();
      
      // Notify parent component to refresh posts
      if (onClose) {
        onClose(true); // Pass true to indicate successful post creation
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(error.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        title: postContent.substring(0, 100) + (postContent.length > 100 ? '...' : ''),
        content: postContent,
        department: user?.department,
        type: 'post'
      };
      
      console.log('Submitting post:', postData);
      const response = await postsAPI.createPost(postData);
      console.log('Post submitted successfully:', response);
      
      handleClose();
      
      // Notify parent component to refresh posts
      if (onClose) {
        onClose(true); // Pass true to indicate successful post creation
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('Add Question')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                activeTab === 'Add Question'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Add Question
            </button>
            <button
              onClick={() => setActiveTab('Create Post')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                activeTab === 'Create Post'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create Post
            </button>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'Add Question' ? (
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="What would you like to ask the SinhgadConnect community?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  placeholder="Add more details to help others understand your question better..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Posting as: {user?.name} ({user?.department} - Year {user?.year})
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !questionTitle.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share something with the SinhgadConnect community..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Posting as: {user?.name} ({user?.department} - Year {user?.year})
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !postContent.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Create Post'}
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
