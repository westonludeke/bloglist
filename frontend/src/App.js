import React, { useState, useEffect } from 'react';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogService';
import loginService from './services/login';
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
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs);
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const fetchBlogs = async () => {
    try {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    } catch (error) {
      setErrorMessage('Error fetching blogs');
    }
  };

  const addBlog = async () => {
    // event.preventDefault();
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

      {!user &&
        <Togglable buttonLabel="sign in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      }

      {user && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>log out</button><br />
          <Togglable buttonLabel="new blog">
            <BlogForm
              title={title}
              author={author}
              url={url}
              handleSubmit={addBlog}
              handleTitleChange={(e) => setTitle(e.target.value)}
              handleAuthorChange={(e) => setAuthor(e.target.value)}
              handleUrlChange={(e) => setUrl(e.target.value)}
            />
          </Togglable>
        </div>
      )}

      <h3>List of Blogs:</h3>
      <ul>
        {blogs.map((blog) => (
          <ul key={blog.id}>
            <p>
              <strong>{blog.title}</strong><br />
              by: {blog.author}<br />
              <a href={formatUrl(blog.url)}>{blog.url}</a><br />
              Likes: {blog.likes}<br />
              { user && (
                <button onClick={() => handleDelete(blog.id)}>delete</button>
              )}
            </p>
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default App;