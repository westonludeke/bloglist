const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    "title": "PG's Essays",
    "author":"Paul Graham",
    "url":"http://www.paulgraham.com/articles.html",
    "likes": "500"
  },
  {
    "title":"Platformer",
    "author":"Casey Newton",
    "url":"platformer.news",
    "likes":"312"
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length);
})

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain("PG's Essays")
})

afterAll(async () => {
  await mongoose.connection.close()
})


