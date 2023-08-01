import React, { useState, useEffect } from 'react';
import axios from 'axios';
import blogService from './services/blogService';
import './index.css';

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

  const handleDelete = async (id) => {
    console.log('Deleting blog with id: ', id);
    try {
      await blogService.remove(id);
      fetchBlogs(); // Refresh the blogs list after deletion
    } catch (error) {
      console.log('id: ', id);
      console.error('Error deleting blog:', error);
    }
  };

  // Function to add "https://" to URLs that don't have a prefix
  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  return (
    <div className="container">
      <h1>Blog Lists</h1>
      <div>
        <h3>Add a New Blog</h3>
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
        <h3>List of Blogs:</h3>
        <ul>
          {blogs.map((blog) => (
            <ul key={blog._id}>
              <p>
                <strong>{blog.title}</strong><br />
                by: {blog.author}<br />
                <a href={formatUrl(blog.url)}>{blog.url}</a><br />
                Likes: {blog.likes}<br />
                <button onClick={() => handleDelete(blog._id)}>Delete</button><br />
              </p>
            </ul>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
