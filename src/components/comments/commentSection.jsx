import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../../features/auth/authSlice';
import commentsAPI from '../../services/api/commentsService';
import { toast } from 'react-toastify';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentSection = ({ postId, onCommentCountUpdate }) => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await commentsAPI.getComments(postId);
      
      // Handle different response formats
      let commentsList = [];
      if (Array.isArray(response)) {
        commentsList = response;
      } else if (response?.comments && Array.isArray(response.comments)) {
        commentsList = response.comments;
      } else if (response?.data && Array.isArray(response.data)) {
        commentsList = response.data;
      }
      
      setComments(commentsList);
      if (onCommentCountUpdate) {
        onCommentCountUpdate(commentsList.length);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        const errorMsg = err.response?.data?.message || 'Failed to load comments';
        setError(errorMsg);
        toast.error(errorMsg);
      }
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    if (!user || !token) {
      toast.error('Please log in to post a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const toastId = toast.loading('Posting comment...');
      
      const response = await commentsAPI.createComment(postId, data.content);
      
      if (response?.commentCount && onCommentCountUpdate) {
        onCommentCountUpdate(response.commentCount);
      }
      
      await loadComments();
      
      toast.update(toastId, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to post comment';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      await commentsAPI.voteComment(commentId, voteType);
      await loadComments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to process vote';
      toast.error(errorMsg);
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-500">Loading comments...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="mt-4">
      <CommentForm onSubmit={handleSubmit} user={user} isSubmitting={isSubmitting} />
      
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onVote={handleVote}
            />
          ))
        ) : (
          <p className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  onCommentCountUpdate: PropTypes.func
};

export default CommentSection;
