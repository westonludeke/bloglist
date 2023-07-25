import React, { useState, useEffect } from 'react';
import axios from 'axios';
import blogService from '.services/blogService';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url, likes: 0 };

    try {
      const addedBlog = await blogService.create(newBlog);
      setBlogs([...blogs, addedBlog]);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  return (
    <div>
      <h1>Blog List</h1>
      <div>
        <h2>Add a New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Author:</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label>URL:</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <button type="submit">Add Blog</button>
        </form>
      </div>
      <div>
        <h2>List of Blogs</h2>
        <ul>
          {blogs.map((blog) => (
            <li key={blog._id}>
              <h3>{blog.title}</h3>
              <p>Author: {blog.author}</p>
              <p>URL: {blog.url}</p>
              <p>Likes: {blog.likes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
