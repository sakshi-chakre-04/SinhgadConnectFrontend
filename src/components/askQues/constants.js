// Post Types for categorization
export const POST_TYPES = {
  QUESTION: 'question',
  DISCUSSION: 'discussion',
  ANNOUNCEMENT: 'announcement'
};

// Labels for post types (display in UI)
export const POST_TYPE_LABELS = {
  [POST_TYPES.QUESTION]: '❓ Question',
  [POST_TYPES.DISCUSSION]: '💬 Discussion',
  [POST_TYPES.ANNOUNCEMENT]: '📢 Announcement'
};

// Department options
export const DEPARTMENTS = [
  'Computer',
  'IT',
  'Mechanical',
  'Civil',
  'Electronics',
  'Electrical',
  'General'
];

// Constants for form data
export const DEFAULT_DEPARTMENT = 'General';
export const DEFAULT_POST_TYPE = POST_TYPES.DISCUSSION;

// Unified validation rules
export const VALIDATION_RULES = {
  title: {
    validate: (value) => {
      if (!value || value.trim() === '') return 'Title is required';
      if (value.length < 5) return 'Title must be at least 5 characters';
      if (value.length > 200) return 'Title cannot exceed 200 characters';
      return true;
    }
  },
  content: {
    validate: (value) => {
      if (!value || value.trim() === '') return 'Content is required';
      if (value.length < 10) return 'Content must be at least 10 characters';
      if (value.length > 5000) return 'Content cannot exceed 5000 characters';
      return true;
    }
  },
  postType: {
    validate: (value) => {
      if (!value) return 'Please select a post type';
      return true;
    }
  },
  department: {
    validate: (value) => {
      if (!value) return 'Please select a department';
      return true;
    }
  }
};

// Factory to build post data from form data
export const buildPostData = (formData, user) => {
  return {
    title: formData.title.trim(),
    content: formData.content.trim(),
    department: formData.department || user?.department || DEFAULT_DEPARTMENT,
    postType: formData.postType || DEFAULT_POST_TYPE
  };
};
