import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../../features/auth/authSlice';
import CommentSection from '../comments/CommentSection';
import { formatRelativeDate } from './utils/date';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon as ChatBubbleLeftIconSolid, SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';

// Post type configuration
const POST_TYPE_CONFIG = {
  question: { icon: '❓', label: 'Question', className: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' },
  discussion: { icon: '💬', label: 'Discussion', className: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' },
  announcement: { icon: '📢', label: 'Announcement', className: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' },
  resource: { icon: '📚', label: 'Resource', className: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' },
};

// Avatar gradient based on user ID
const getAvatarGradient = (name) => {
  const gradients = [
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-fuchsia-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-violet-600',
    'bg-gradient-to-br from-purple-500 to-indigo-600',
    'bg-gradient-to-br from-pink-500 to-rose-600'
  ];
  const index = name?.charCodeAt(0) % gradients.length || 0;
  return gradients[index];
};

// Sentiment badge component
const SentimentBadge = ({ sentiment }) => {
  if (!sentiment?.label || sentiment.label === 'neutral') return null;

  const config = {
    positive: { icon: '😊', tooltip: 'Positive sentiment' },
    negative: { icon: '😔', tooltip: 'Negative sentiment' },
  };

  const item = config[sentiment.label];
  return item ? (
    <span className="text-lg" title={item.tooltip}>{item.icon}</span>
  ) : null;
};

const PostItem = ({ post, show, onToggleComments, onVote, onCommentCountUpdate, onSuccessRefresh }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [aiSummary, setAiSummary] = useState(post.aiSummary || '');
  const [showSummary, setShowSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const currentUser = useSelector(selectUser);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  // Get user and author IDs as strings for reliable comparison
  const currentUserId = currentUser?._id || currentUser?.id || '';
  const postAuthorId = post.author?._id || post.author?.id || '';
  const isAuthor = currentUserId && postAuthorId && String(currentUserId) === String(postAuthorId);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api'}/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        if (onSuccessRefresh) onSuccessRefresh();
      } else {
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSummarize = async () => {
    if (aiSummary) {
      setShowSummary(!showSummary);
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api'}/posts/${post._id}/summarize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setAiSummary(data.summary);
        setShowSummary(true);
      } else {
        alert(data.message || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summary error:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const postTypeConfig = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.discussion;
  const hasLongContent = post.content?.length > 300;
  const displayContent = showFullContent
    ? post.content
    : (hasLongContent ? (post.summary || post.content.substring(0, 300) + '...') : post.content);

  const upvotes = post.upvotes?.length || post.upvoteCount || 0;
  const downvotes = post.downvotes?.length || post.downvoteCount || 0;
  const netScore = upvotes - downvotes;

  return (
    <article
      className="bg-white p-5 transition-all duration-200 hover:bg-gray-50/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient */}
          <Link
            to={`/user/${post.author?._id || post.author?.id}`}
            className={`w-11 h-11 ${getAvatarGradient(post.author?.name)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-105 transition-transform`}
          >
            {post.author?.name?.charAt(0).toUpperCase() || 'U'}
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/user/${post.author?._id || post.author?.id}`}
                className="font-semibold text-gray-900 hover:text-[var(--primary-600)] transition-colors"
              >
                {post.author?.name || 'Unknown User'}
              </Link>
              <SentimentBadge sentiment={post.sentiment} />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-500">{post.author?.department}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400">{formatRelativeDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Badges & Delete */}
        <div className="flex items-center gap-2">
          <span className={`tag ${postTypeConfig.className}`}>
            {postTypeConfig.icon} {postTypeConfig.label}
          </span>
          {isAuthor && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete post"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Content */}
      <div className="mb-4">
        <Link to={`/posts/${post._id}`} className="group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary-600)] transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {displayContent}
        </p>
        {hasLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-[var(--primary-500)] hover:text-[var(--primary-600)] text-sm font-medium mt-2 flex items-center gap-1"
          >
            {showFullContent ? 'Show less' : 'Read more'}
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              to={`/search?q=${tag}`}
              className="tag tag-primary hover:scale-105 transition-transform cursor-pointer"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Attachments */}
      {post.attachments?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-3">
            {post.attachments.map((file, index) => (
              file.type === 'image' ? (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-28 w-28 object-cover hover:scale-105 transition-transform"
                  />
                </a>
              ) : (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--primary-50)] transition-colors group"
                >
                  <span className="text-xl">{file.type === 'pdf' ? '📄' : '📎'}</span>
                  <span className="text-sm text-gray-700 max-w-[120px] truncate group-hover:text-[var(--primary-600)]">
                    {file.filename}
                  </span>
                </a>
              )
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          {/* Upvote */}
          <button
            onClick={() => onVote(post._id, 'upvote')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${post.userVote === 1
              ? 'bg-green-100 text-green-600'
              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
          >
            <ChevronUpIcon className="w-5 h-5" strokeWidth={2.5} />
            <span className="font-medium">{upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => onVote(post._id, 'downvote')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${post.userVote === -1
              ? 'bg-red-100 text-red-500'
              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
          >
            <ChevronDownIcon className="w-5 h-5" strokeWidth={2.5} />
            <span className="font-medium">{downvotes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => onToggleComments(post._id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ml-2 ${show
              ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
          >
            {show ? (
              <ChatBubbleLeftIconSolid className="w-5 h-5" />
            ) : (
              <ChatBubbleLeftIcon className="w-5 h-5" />
            )}
            <span className="font-medium">{post.commentCount || 0}</span>
          </button>

          {/* AI Summarize */}
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ml-2 ${showSummary
              ? 'bg-violet-100 text-violet-600'
              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              } ${isSummarizing ? 'opacity-60 cursor-wait' : ''}`}
            title={aiSummary ? (showSummary ? 'Hide summary' : 'Show summary') : 'Generate AI summary'}
          >
            {isSummarizing ? (
              <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            ) : showSummary ? (
              <SparklesIconSolid className="w-5 h-5" />
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
            <span className="font-medium text-sm">
              {isSummarizing ? 'Summarizing...' : (aiSummary ? (showSummary ? 'Hide' : 'Summary') : 'Summarize')}
            </span>
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium px-2.5 py-1 rounded-full transition-all ${post.userVote === 1
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : netScore > 0
                  ? 'bg-[var(--lavender-light)] text-[var(--lavender-main)]'
                  : netScore < 0
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-[var(--gray-purple)]'
              }`}
          >
            {netScore > 0 ? '+' : ''}{netScore} pts
          </span>
        </div>
      </div>

      {/* AI Summary Display */}
      {showSummary && aiSummary && (
        <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
          <div className="flex items-start gap-2">
            <SparklesIconSolid className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">AI Summary</span>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comment Section */}
      {show && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <CommentSection
            postId={post._id}
            onCommentCountUpdate={(count) => onCommentCountUpdate(post._id, count)}
            onSuccessRefresh={onSuccessRefresh}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. All comments on this post will also be deleted.</p>
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
    </article>
  );
};

export default PostItem;
