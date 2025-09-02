import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CommentForm = ({ onAddComment }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onAddComment(content);
      setContent('');
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => {
          setContent(editor.getData());
        }}
      />
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CommentForm;