import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from '../comments/CommentSection';
import { formatRelativeDate } from './utils/date';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon as ChatBubbleLeftIconSolid } from '@heroicons/react/24/solid';

// Post type configuration
const POST_TYPE_CONFIG = {
  question: { icon: '❓', label: 'Question', className: 'tag-purple' },
  discussion: { icon: '💬', label: 'Discussion', className: 'tag-blue' },
  announcement: { icon: '📢', label: 'Announcement', className: 'tag-warning' },
  resource: { icon: '📚', label: 'Resource', className: 'tag-success' },
};

// Avatar gradient based on user ID
const getAvatarGradient = (name) => {
  const gradients = [
    'avatar-gradient-1',
    'avatar-gradient-2',
    'avatar-gradient-3',
    'avatar-gradient-4',
    'avatar-gradient-5'
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

  const postTypeConfig = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.discussion;
  const hasLongContent = post.content?.length > 300;
  const displayContent = showFullContent
    ? post.content
    : (hasLongContent ? (post.summary || post.content.substring(0, 300) + '...') : post.content);

  const upvotes = post.upvotes?.length || post.upvoteCount || 0;
  const downvotes = post.downvotes?.length || post.downvoteCount || 0;
  const netScore = upvotes - downvotes;

  return (
    <article className="modern-card animate-fadeIn p-6 mb-6">
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

        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className={`tag ${postTypeConfig.className}`}>
            {postTypeConfig.icon} {postTypeConfig.label}
          </span>
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
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
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
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${netScore > 0 ? 'bg-green-100 text-green-600' :
            netScore < 0 ? 'bg-red-100 text-red-500' :
              'bg-gray-100 text-gray-500'
            }`}>
            {netScore > 0 ? '+' : ''}{netScore} pts
          </span>
        </div>
      </div>

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
    </article>
  );
};

export default PostItem;
