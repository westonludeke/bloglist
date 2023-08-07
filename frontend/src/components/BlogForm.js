import React, { useState } from 'react';

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const addBlog = (event) => {
    event.preventDefault();
    handleSubmit({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h3>Add a New Blog</h3>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="titleInput">Title:</label>
          <input id="titleInput" type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label htmlFor="authorInput">Author:</label>
          <input id="authorInput" type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          <label htmlFor="urlInput">URL:</label>
          <input id="urlInput" type="text" value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;
