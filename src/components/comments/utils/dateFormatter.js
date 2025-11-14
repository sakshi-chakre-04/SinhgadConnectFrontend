
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateComment = (value) => {
  if (!value || value.trim() === '') return 'Comment cannot be empty';
  if (value.length > 1000) return 'Comment cannot exceed 1000 characters';
  return true;
};

