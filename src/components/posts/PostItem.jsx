  import React from 'react';
  import CommentSection from '../comments/CommentSection';
  import { formatRelativeDate } from './utils/date';

  const PostItem = ({ post, show, onToggleComments, onVote, onCommentCountUpdate, onSuccessRefresh }) => {
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {post.department}
            </span>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 leading-relaxed">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onVote(post._id, 'upvote')}
                className={`flex items-center space-x-1 ${post.userVote === 1 ? 'text-green-500' : 'text-gray-500'}`}
              >
                <span>▲</span>
                <span>{post.upvotes?.length || 0}</span>
              </button>

              <button
                onClick={() => onVote(post._id, 'downvote')}
                className={`flex items-center space-x-1 ${post.userVote === -1 ? 'text-red-500' : 'text-gray-500'}`}
              >
                <span>▼</span>
                <span>{post.downvotes?.length || 0}</span>
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

            <div className="text-sm text-gray-500">
              Score: {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
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
