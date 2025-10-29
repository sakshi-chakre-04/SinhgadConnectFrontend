import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectToken } from '../../features/auth/authSlice';
import commentsAPI from '../../services/commentsAPI';
import { toast } from 'react-toastify';

// Validation function for comments
const validateComment = (value) => {
  if (!value || value.trim() === '') return 'Comment cannot be empty';
  if (value.length > 1000) return 'Comment cannot exceed 1000 characters';
  return true;
};

const CommentSection = ({ postId, onCommentCountUpdate }) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading comments for post:', postId);
      
      const commentsData = await commentsAPI.getComments(postId);
      console.log('Received comments data:', commentsData);
      
      // Ensure we have a valid array and handle potential nested structure
      let validComments = [];
      let commentCount = 0;
      
      if (Array.isArray(commentsData)) {
        validComments = commentsData;
        commentCount = commentsData.length;
      } else if (commentsData) {
        // Handle API response with nested comments array
        if (Array.isArray(commentsData.comments)) {
          validComments = commentsData.comments;
          commentCount = commentsData.comments.length;
        } else if (Array.isArray(commentsData.data)) {
          validComments = commentsData.data;
          commentCount = commentsData.data.length;
        }
        
        // Update comment count if provided separately
        if (typeof commentsData.count === 'number') {
          commentCount = commentsData.count;
        } else if (typeof commentsData.total === 'number') {
          commentCount = commentsData.total;
        }
      }
      
      console.log(`Setting ${validComments.length} comments (total: ${commentCount})`);
      setComments(validComments);
      
      // Notify parent component about the updated comment count if needed
      if (typeof onCommentCountUpdate === 'function') {
        console.log(`Notifying parent of comment count update: ${commentCount}`);
        onCommentCountUpdate(commentCount);
      } else {
        console.log('No onCommentCountUpdate callback provided');
      }
      
    } catch (err) {
      console.error('Error loading comments:', {
        error: err,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Don't show error toast for 401 as it's handled by interceptor
      if (err.response?.status !== 401) {
        const errorMessage = err.response?.data?.message || 'Failed to load comments';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!user || !token) {
      console.error('User not authenticated', { user, token });
      toast.error('Please log in to post a comment');
      return;
    }

    try {
      console.log('Attempting to create comment with:', { postId, content: data.content });
      
      // Show loading state
      const toastId = toast.loading('Posting comment...');
      
      // Create the comment
      const response = await commentsAPI.createComment(postId, data.content);
      console.log('Comment created successfully:', response);
      
      // Reset the form
      reset();
      
      // If the response includes a comment count, update the parent component
      if (typeof response.commentCount !== 'undefined' && typeof onCommentCountUpdate === 'function') {
        console.log('Updating comment count from response:', response.commentCount);
        onCommentCountUpdate(response.commentCount);
      }
      
      // Refresh the comments list to get the latest data from the server
      await loadComments();
      
      // Update the toast to show success
      toast.update(toastId, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Error in onSubmit:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || 'Failed to post comment';
      setError(errorMessage);
      setFormError('root', {
        type: 'manual',
        message: errorMessage
      });
      toast.error(errorMessage);
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      // Optimistic UI update
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment._id === commentId) {
            const updatedComment = { ...comment };
            
            // Remove previous vote if exists
            if (comment.userVote === 1) {
              updatedComment.upvotes = updatedComment.upvotes.filter(id => id !== user._id);
            } else if (comment.userVote === -1) {
              updatedComment.downvotes = updatedComment.downvotes.filter(id => id !== user._id);
            }

            // Add new vote
            if ((voteType === 'upvote' && comment.userVote !== 1) || 
                (voteType === 'downvote' && comment.userVote === -1)) {
              updatedComment.userVote = voteType === 'upvote' ? 1 : -1;
              if (voteType === 'upvote') {
                updatedComment.upvotes = [...(updatedComment.upvotes || []), user._id];
              } else {
                updatedComment.downvotes = [...(updatedComment.downvotes || []), user._id];
              }
            } else {
              updatedComment.userVote = 0; // Toggle off if clicking the same vote
            }
            
            return updatedComment;
          }
          return comment;
        })
      );

      // Make the API call
      await commentsAPI.voteComment(commentId, voteType);
      
      // Refresh comments to ensure consistency with server
      loadComments();
    } catch (err) {
      console.error('Error voting on comment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to process vote';
      toast.error(errorMessage);
      
      // Revert optimistic update on error
      loadComments();
    }
  };

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-4">
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          {errors.root && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {errors.root.message}
            </div>
          )}
          <div className="flex items-start">
            <div className="flex-1">
              <textarea
                {...register('content', {
                validate: validateComment
              })}
                placeholder="Write a comment..."
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.content ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows={3}
                aria-invalid={errors.content ? 'true' : 'false'}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Please log in to leave a comment
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment?._id || Math.random()} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {comment?.author?.name || user?.name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment?.createdAt) || 'Just now'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => comment?._id && handleVote(comment._id, 'upvote')}
                    className={`p-1 ${comment?.upvotes?.includes(user?._id) ? 'text-green-500' : 'text-gray-500'}`}
                    disabled={!user}
                  >
                    ▲ {comment?.upvotes?.length || 0}
                  </button>
                  <button
                    onClick={() => comment?._id && handleVote(comment._id, 'downvote')}
                    className={`p-1 ${comment?.downvotes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'}`}
                    disabled={!user}
                  >
                    ▼ {comment?.downvotes?.length || 0}
                  </button>
                </div>
              </div>
              <p className="mt-2">{comment?.content || ''}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            {loading ? 'Loading comments...' : 'No comments yet. Be the first to comment!'}
          </p>
        )}
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  onCommentCountUpdate: PropTypes.func
};

CommentSection.defaultProps = {
  onCommentCountUpdate: null
};

export default CommentSection;
