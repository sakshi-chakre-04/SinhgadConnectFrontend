import React, { useState, useEffect } from 'react';
import { fetchComments, postComment, upvoteComment, downvoteComment } from '../../services/commentsAPI';
import Comment from './comment';
import CommentForm from './commentForm';
import './CommentSection.css';

const CommentSection = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const commentsData = await fetchComments(postId);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadComments();
    }
  }, [postId]);

  const handleAddComment = async (content) => {
    try {
      const newComment = await postComment(postId, userId, content);
      setComments([newComment, ...comments]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      const updatedComment = await upvoteComment(commentId, userId);
      setComments(comments.map(c => c._id === commentId ? updatedComment : c));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownvote = async (commentId) => {
    try {
      const updatedComment = await downvoteComment(commentId, userId);
      setComments(comments.map(c => c._id === commentId ? updatedComment : c));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <CommentForm onAddComment={handleAddComment} />
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              onUpvote={() => handleUpvote(comment._id)}
              onDownvote={() => handleDownvote(comment._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;