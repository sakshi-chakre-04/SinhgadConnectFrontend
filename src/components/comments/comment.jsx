import React from 'react';

const Comment = ({ comment, onUpvote, onDownvote }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <strong>{comment.author.name}</strong>
          <span className="author-details">
            {comment.author.department} - {comment.author.year}
          </span>
        </div>
        <div className="comment-date">
          {formatDate(comment.createdAt)}
        </div>
      </div>
      
      <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content }} />
      
      <div className="comment-actions">
        <button 
          className="vote-btn upvote-btn" 
          onClick={onUpvote}
          title="Upvote comment"
        >
          {comment.upvoteCount || comment.upvotes?.length || 0}
        </button>
        <button 
          className="vote-btn downvote-btn" 
          onClick={onDownvote}
          title="Downvote comment"
        >
          {comment.downvoteCount || comment.downvotes?.length || 0}
        </button>
        <span className="net-votes">
          Net: {comment.netVotes || (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0)}
        </span>
      </div>
    </div>
  );
};

export default Comment;