import React from 'react';

const BlogForm = ({ title, author, url, handleSubmit, handleTitleChange, handleAuthorChange, handleUrlChange }) => {
  return (
    <div data-testid="blog-form-container">
      <h3>Add a New Blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input id="title" type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Author:</label>
          <input id="author" type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          <label>URL:</label>
          <input id="url" type="text" value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;