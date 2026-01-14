// CommentItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';
import { formatDate } from './utils/dateFormatter';
import { TrashIcon } from '@heroicons/react/24/outline';

const CommentItem = ({ comment, user, onVote, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = useSelector(selectToken);

  const isAuthor = user && comment?.author &&
    String(user._id || user.id || '') === String(comment.author._id || comment.author.id || '');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${comment._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        if (onDelete) onDelete(comment._id);
      } else {
        alert(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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

          <div className="flex items-center gap-2">
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
                  className={`p-1 transition-colors ${hasVoted
                    ? `text-${color}-500`
                    : 'text-gray-500 hover:text-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {icon} {votes?.length || 0}
                </button>
              );
            })}

            {isAuthor && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete comment"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Comment?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
  onVote: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default CommentItem;
