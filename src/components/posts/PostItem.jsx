import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from '../comments/CommentSection';
import { formatRelativeDate } from './utils/date';

// Post type icons and colors
const POST_TYPE_CONFIG = {
  question: { icon: '❓', label: 'Question', color: 'bg-purple-100 text-purple-700' },
  discussion: { icon: '💬', label: 'Discussion', color: 'bg-blue-100 text-blue-700' },
  announcement: { icon: '📢', label: 'Announcement', color: 'bg-orange-100 text-orange-700' },
};

// Sentiment indicator component
const SentimentBadge = ({ sentiment }) => {
  if (!sentiment?.label || sentiment.label === 'neutral') return null;

  const config = {
    positive: { icon: '😊', color: 'text-green-600' },
    negative: { icon: '😔', color: 'text-red-500' },
  };

  const { icon, color } = config[sentiment.label] || {};
  return icon ? <span className={`${color} text-sm`} title={`Sentiment: ${sentiment.label}`}>{icon}</span> : null;
};

const PostItem = ({ post, show, onToggleComments, onVote, onCommentCountUpdate, onSuccessRefresh }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const postTypeConfig = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.discussion;
  const hasLongContent = post.content?.length > 300;
  const displayContent = showFullContent ? post.content : (hasLongContent ? post.summary || post.content.substring(0, 300) + '...' : post.content);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{post.author?.name || 'Unknown User'}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{post.author?.department} - Year {post.author?.year}</span>
                <span className="mx-2">•</span>
                <span>{formatRelativeDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${postTypeConfig.color}`}>
              {postTypeConfig.icon} {postTypeConfig.label}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {post.department}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Link to={`/posts/${post._id}`} className="hover:text-indigo-600 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
          </Link>
          <p className="text-gray-600 leading-relaxed">{displayContent}</p>
          {hasLongContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 font-medium"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onVote(post._id, 'upvote')}
              className={`flex items-center space-x-1 ${post.userVote === 1 ? 'text-green-500' : 'text-gray-500'}`}
            >
              <span>▲</span>
              <span>{post.upvotes?.length || post.upvoteCount || 0}</span>
            </button>

            <button
              onClick={() => onVote(post._id, 'downvote')}
              className={`flex items-center space-x-1 ${post.userVote === -1 ? 'text-red-500' : 'text-gray-500'}`}
            >
              <span>▼</span>
              <span>{post.downvotes?.length || post.downvoteCount || 0}</span>
            </button>

            <button
              onClick={() => onToggleComments(post._id)}
              className={`flex items-center space-x-1 ${show ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            >
              <span>💬</span>
              <span>
                {(post.commentCount || 0)} Comment{post.commentCount !== 1 ? 's' : ''}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SentimentBadge sentiment={post.sentiment} />
            <span>Score: {(post.upvotes?.length || post.upvoteCount || 0) - (post.downvotes?.length || post.downvoteCount || 0)}</span>
          </div>
        </div>

        {show && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <CommentSection
              postId={post._id}
              onCommentCountUpdate={(count) => onCommentCountUpdate(post._id, count)}
              onSuccessRefresh={onSuccessRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
