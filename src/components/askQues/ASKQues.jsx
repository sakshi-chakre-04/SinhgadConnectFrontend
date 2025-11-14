import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { usePostSubmission } from '../../hooks/usePostSubmission';
import ErrorAlert from './ErrorAlert';
import TabButton from './TabButton';
import FormField from './FormField';
import FormFooter from './FormFooter';
import { TABS, POST_TYPES, VALIDATION_RULES } from './constants';

const createFormHandler = (submitPost, postType) => async (data) => {
  try {
    await submitPost(data, postType);
  } catch (error) {
    console.error(`Error creating ${postType}:`, error.message);
  }
};

const ASKQues = ({ isOpen, onClose, onPostCreated, initialTab = TABS.QUESTION }) => {
  const { activeTab, closeModal } = useModal();
  const user = useSelector(selectUser);
  
  // ✅ Hooks at top level
  const questionForm = useForm();
  const postForm = useForm();
  const [currentTab, setCurrentTab] = useState(initialTab || TABS.QUESTION);

  // ✅ Define handleClose FIRST
const handleClose = useCallback((shouldRefresh = false) => {
  onClose(shouldRefresh);
}, [onClose]);


  // ✅ Now use it in the hook - NO DUPLICATE
  const { isSubmitting, submitPost } = usePostSubmission(user, handleClose, onPostCreated);

  // ✅ Create form handlers
  const onSubmitQuestion = createFormHandler(submitPost, POST_TYPES.QUESTION);
  const onSubmitPost = createFormHandler(submitPost, POST_TYPES.POST);

  // ✅ Reset forms when modal opens - NO form objects in dependencies
  useEffect(() => {
    if (isOpen) {
      questionForm.reset();
      postForm.reset();
      setCurrentTab(initialTab || activeTab || TABS.QUESTION);
    }
  }, [isOpen, initialTab, activeTab]);

  if (!isOpen) return null;

  const isQuestion = currentTab === TABS.QUESTION;
  const currentForm = isQuestion ? questionForm : postForm;
  const onSubmit = isQuestion ? onSubmitQuestion : onSubmitPost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex space-x-1">
            {Object.values(TABS).map((tab) => (
              <TabButton 
                key={tab}
                label={tab}
                isActive={currentTab === tab}
                onClick={() => setCurrentTab(tab)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
            <ErrorAlert message={currentForm.formState.errors.root?.message} />
            
            {isQuestion ? (
              <>
                <FormField
                  id="title"
                  label="Question Title"
                  required
                  error={currentForm.formState.errors.title}
                  register={currentForm.register}
                  validation={VALIDATION_RULES.questionTitle}
                  placeholder="What would you like to ask the SinhgadConnect community?"
                />
                <FormField
                  id="description"
                  label="Description"
                  type="textarea"
                  error={currentForm.formState.errors.description}
                  register={currentForm.register}
                  validation={VALIDATION_RULES.questionDescription}
                  placeholder="Add more details to help others understand your question better..."
                  rows={4}
                />
              </>
            ) : (
              <FormField
                id="content"
                label="What's on your mind?"
                type="textarea"
                required
                error={currentForm.formState.errors.content}
                register={currentForm.register}
                validation={VALIDATION_RULES.postContent}
                placeholder="Share something with the SinhgadConnect community..."
                rows={6}
              />
            )}

            <FormFooter
              user={user}
              isSubmitting={isSubmitting}
              onCancel={() => handleClose(false)}
              submitText={isQuestion ? 'Post Question' : 'Create Post'}
              showSpinner={!isQuestion}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ASKQues;
