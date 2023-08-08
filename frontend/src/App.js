import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogService';
import loginService from './services/login';
import './index.css';

const App = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleToggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

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
      setShowLoginForm(false);
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
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
    setShowLoginForm(false);
  };

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
      setSuccessMessage(`Blog added successfully: ${addedBlog.title}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setErrorMessage('Error adding blog');
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id);
      setSuccessMessage('Successfully deleted blog');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      fetchBlogs(); // Refresh the blogs list after deletion
    } catch (error) {
      console.log('id: ', id);
      setErrorMessage('Error deleting blog');
    }
  };

  const sortBlogsByTitle = (blogA, blogB) => {
    const titleA = blogA.title.toLowerCase();
    const titleB = blogB.title.toLowerCase();

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  };

  return (
    <div className={`container ${showLoginForm ? 'with-form' : ''}`}>
      <h1>Cool Tech Blogs!</h1>
      <Notification message={errorMessage} />
      {successMessage && (
        <div className="success">
          {successMessage}
        </div>
      )}
      {!user &&
        <Togglable buttonLabel="sign in" handleToggle={handleToggleLoginForm}>
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
        {blogs.sort(sortBlogsByTitle).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;