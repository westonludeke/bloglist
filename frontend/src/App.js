import React, { useState, useEffect } from 'react';
// import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogService';
import loginService from './services/login'
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000)
    }
  }
  
  const fetchBlogs = async () => {
    try {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    } catch (error) {
      setErrorMessage('Error fetching blogs');
    }
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url, likes: 0 };

    try {
      const addedBlog = await blogService.create(newBlog);
      setBlogs([...blogs, addedBlog]);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      setErrorMessage('Error adding blog');
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id);
      fetchBlogs(); // Refresh the blogs list after deletion
    } catch (error) {
      console.log('id: ', id);
      setErrorMessage('Error deleting blog');
    }
  };

  // const handleLogin = (event) => {
  //   event.preventDefault();
  //   console.log('logging in with', username, password);
  // }

  // Function to add "https://" to URLs that don't have a prefix
  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  };

  return (
    <div className="container">
      <h1>Cool Tech Blogs!</h1>
      <Notification message={errorMessage} />

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

      <div>
        <h3>Add a New Blog</h3>
        <form onSubmit={addBlog}>
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
            <ul key={blog.id}>
              <p>
                <strong>{blog.title}</strong><br />
                by: {blog.author}<br />
                <a href={formatUrl(blog.url)}>{blog.url}</a><br />
                Likes: {blog.likes}<br />
                <button onClick={() => handleDelete(blog.id)}>Delete</button><br />
              </p>
            </ul>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;