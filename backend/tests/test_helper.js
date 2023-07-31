const Blog = require('../models/blog');

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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}