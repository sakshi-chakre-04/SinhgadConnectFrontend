import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import CommentSection from './commentSection';
import './CommentSection.css';

const CommentsExample = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedPostId, setSelectedPostId] = useState('');

  // Mock post data for demonstration
  const mockPosts = [
    { id: '507f1f77bcf86cd799439011', title: 'Welcome to SinhgadConnect!' },
    { id: '507f1f77bcf86cd799439012', title: 'Computer Department Updates' },
    { id: '507f1f77bcf86cd799439013', title: 'Upcoming Tech Events' }
  ];

  if (!user) {
    return (
      <div className="comments-example">
        <h2>Comments System Demo</h2>
        <p>Please log in to test the comments functionality.</p>
      </div>
    );
  }

  return (
    <div className="comments-example">
      <h2>Comments System Demo</h2>
      <p>Welcome, {user.name}! Test the comments functionality below.</p>
      
      <div className="post-selector">
        <label htmlFor="post-select">Select a post to view comments:</label>
        <select 
          id="post-select"
          value={selectedPostId} 
          onChange={(e) => setSelectedPostId(e.target.value)}
        >
          <option value="">Choose a post...</option>
          {mockPosts.map(post => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
      </div>

      {selectedPostId && (
        <div className="selected-post">
          <h3>Post: {mockPosts.find(p => p.id === selectedPostId)?.title}</h3>
          <CommentSection 
            postId={selectedPostId} 
            userId={user.id} 
          />
        </div>
      )}

      <div className="demo-instructions">
        <h4>How to test:</h4>
        <ol>
          <li>Select a post from the dropdown above</li>
          <li>Add a comment using the rich text editor</li>
          <li>Vote on comments using the 👍 and 👎 buttons</li>
          <li>View real-time vote counts and comment metadata</li>
        </ol>
        
        <h4>Features included:</h4>
        <ul>
          <li>✅ Rich text comment editor (CKEditor)</li>
          <li>✅ Real-time comment posting</li>
          <li>✅ Upvote/Downvote system</li>
          <li>✅ Author information display</li>
          <li>✅ Timestamp formatting</li>
          <li>✅ Error handling and loading states</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default CommentsExample;
