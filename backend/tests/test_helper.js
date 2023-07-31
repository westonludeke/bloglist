const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    "title": "PG's Essays",
    "author": "Paul Graham",
    "url": "http://www.paulgraham.com/articles.html",
    "likes": "500"
  },
  {
    "title":"Platformer",
    "author":"Casey Newton",
    "url": "platformer.news",
    "likes": "312"
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,
}