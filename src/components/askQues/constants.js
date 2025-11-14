export const TABS = {
  QUESTION: 'Add Question',
  POST: 'Create Post'
};

export const POST_TYPES = {
  QUESTION: 'question',
  POST: 'post'
};

// Constants for form data transformation
export const DEFAULT_DEPARTMENT = 'General';
export const TITLE_MAX_LENGTH = 100;

export const VALIDATION_RULES = {
  questionTitle: {
    validate: (value) => {
      if (!value || value.trim() === '') return 'Question title is required';
      if (value.length < 10) return 'Title must be at least 10 characters';
      if (value.length > 200) return 'Title cannot exceed 200 characters';
      return true;
    }
  },
  questionDescription: {
    validate: (value) => {
      if (value && value.length > 2000) return 'Description cannot exceed 2000 characters';
      return true;
    }
  },
  postContent: {
    validate: (value) => {
      if (!value || value.trim() === '') return 'Post content is required';
      if (value.length < 10) return 'Post must be at least 10 characters';
      if (value.length > 10000) return 'Post cannot exceed 10000 characters';
      return true;
    }
  }
};

// Factory to build post data from form data
export const buildPostData = (formData, postType, user) => {
  const baseData = {
    department: user?.department || DEFAULT_DEPARTMENT,
    type: postType
  };

  if (postType === POST_TYPES.QUESTION) {
    return {
      ...baseData,
      title: formData.title,
      content: formData.description || `Question posted by ${user?.name}`
    };
  }

  const truncateTitle = (content) => 
    content.substring(0, TITLE_MAX_LENGTH) + 
    (content.length > TITLE_MAX_LENGTH ? '...' : '');

  return {
    ...baseData,
    title: truncateTitle(formData.content),
    content: formData.content
  };
};
