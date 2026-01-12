import React from 'react';
import PostItem from './PostItem';

const PostsList = ({ posts, showComments, onToggleComments, onVote, onCommentCountUpdate, onSuccessRefresh }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
        <p className="text-gray-600">Be the first to share something with the community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          show={!!showComments[post._id]}
          onToggleComments={onToggleComments}
          onVote={onVote}
          onCommentCountUpdate={onCommentCountUpdate}
          onSuccessRefresh={onSuccessRefresh}
        />
      ))}
    </div>
  );
};

export default PostsList;
