import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentsAPI } from '../../services/commentsAPI';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getComments(postId);
      setComments(data.comments || []);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await commentsAPI.createComment(postId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    }
  };

  const handleVote = async (commentId, voteType) => {
    try {
      await commentsAPI.voteComment(commentId, voteType);
      loadComments(); // Refresh comments to show updated votes
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="mt-4">
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Please log in to leave a comment
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{comment.author?.name || 'Anonymous'}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(comment._id, 'upvote')}
                  className={`p-1 ${comment.upvotes?.includes(user?._id) ? 'text-green-500' : 'text-gray-500'}`}
                >
                  ▲ {comment.upvotes?.length || 0}
                </button>
                <button
                  onClick={() => handleVote(comment._id, 'downvote')}
                  className={`p-1 ${comment.downvotes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'}`}
                >
                  ▼ {comment.downvotes?.length || 0}
                </button>
              </div>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
