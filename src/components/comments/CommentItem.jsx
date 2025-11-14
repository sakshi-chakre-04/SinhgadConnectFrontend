// CommentItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from './utils/dateFormatter';
const CommentItem = ({ comment, user, onVote }) => (
  <div className="border-b pb-4">
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {comment?.author?.name || 'Anonymous'}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(comment?.createdAt)}
          </span>
        </div>
        <p className="mt-2 text-gray-700">{comment?.content}</p>
      </div>
      
      <div className="flex gap-2">
        {[
          { type: 'upvote', icon: '▲', color: 'green' },
          { type: 'downvote', icon: '▼', color: 'red' }
        ].map(({ type, icon, color }) => {
          const votes = type === 'upvote' ? comment?.upvotes : comment?.downvotes;
          const hasVoted = votes?.includes(user?._id);
          return (
            <button
              key={type}
              onClick={() => comment?._id && onVote(comment._id, type)}
              disabled={!user}
              className={`p-1 transition-colors ${
                hasVoted 
                  ? `text-${color}-500` 
                  : 'text-gray-500 hover:text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {icon} {votes?.length || 0}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

CommentItem.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.shape({ name: PropTypes.string }),
    createdAt: PropTypes.string,
    content: PropTypes.string,
    upvotes: PropTypes.array,
    downvotes: PropTypes.array
  }).isRequired,
  user: PropTypes.shape({ _id: PropTypes.string }),
  onVote: PropTypes.func.isRequired
};

export default CommentItem;
