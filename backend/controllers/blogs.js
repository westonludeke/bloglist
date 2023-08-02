const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

 const savedBlog = await blog.save();
 user.blogs = user.blogs.concat(savedBlog._id);
 await user.save();

 response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id);

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  user.blogs = user.blogs.concat(updatedBlog._id);
  await user.save();
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id;

  try {
    // Delete the blog from the blogs collection
    await Blog.findByIdAndRemove(blogId);

    // Find all users who have the blog's id in their blogs array
    const usersWithBlog = await User.find({ blogs: blogId });

    // Remove the blog's id from the blogs array of each user
    for (const user of usersWithBlog) {
      user.blogs = user.blogs.filter((blog) => blog.toString() !== blogId);
      await user.save();
    }

    response.status(204).end();
  } catch (error) {
    response.status(500).json({ error: 'Server error' });
  }

});

module.exports = blogsRouter;
