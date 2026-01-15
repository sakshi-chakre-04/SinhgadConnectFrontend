// CommentItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';
import { formatDate } from './utils/dateFormatter';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon as ChevronUpIconSolid, ChevronDownIcon as ChevronDownIconSolid } from '@heroicons/react/24/solid';

const getAvatarGradient = (name) => {
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500'
  ];
  const index = name?.charCodeAt(0) % gradients.length || 0;
  return gradients[index];
};

const CommentItem = ({ comment, user, onVote, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = useSelector(selectToken);

  const isAuthor = user && comment?.author &&
    String(user._id || user.id || '') === String(comment.author._id || comment.author.id || '');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api'}/comments/${comment._id}`, {
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
      <div className="group relative bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm transition-all mb-3 animate-fadeIn">
        <div className="flex justify-between items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0 mt-1">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(comment?.author?.name)} flex items-center justify-center text-white font-bold shadow-md`}>
              {comment?.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 truncate">
                {comment?.author?.name || 'Anonymous'}
              </span>
              <span className="text-gray-300 mx-1">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {formatDate(comment?.createdAt)}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
              {comment?.content}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1 border border-white/40">
                {[
                  { type: 'upvote', Icon: ChevronUpIcon, SolidIcon: ChevronUpIconSolid, color: 'text-green-600', activeBg: 'bg-green-50' },
                  { type: 'downvote', Icon: ChevronDownIcon, SolidIcon: ChevronDownIconSolid, color: 'text-red-500', activeBg: 'bg-red-50' }
                ].map(({ type, Icon, SolidIcon, color, activeBg }) => {
                  const votes = type === 'upvote' ? comment?.upvotes : comment?.downvotes;
                  const hasVoted = votes?.includes(user?._id);
                  const VoteIcon = hasVoted ? SolidIcon : Icon;

                  return (
                    <button
                      key={type}
                      onClick={() => comment?._id && onVote(comment._id, type)}
                      disabled={!user}
                      className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${hasVoted
                        ? `${color} ${activeBg}`
                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                        } disabled:opacity-50`}
                    >
                      <VoteIcon className="w-4 h-4" strokeWidth={2.5} />
                      <span className={`text-xs font-bold ${hasVoted ? color : 'text-gray-500'}`}>
                        {votes?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isAuthor && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto opacity-0 group-hover:opacity-100"
                  title="Delete comment"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
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
