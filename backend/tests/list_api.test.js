const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
})

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map(r => r.title);
  expect(titles).toContain("PG's Essays");
})

test('a valid blog can be added', async () => {
  const newBlog = {
    "title": "Borderland Beat",
    "author": "Sol Prendido",
    "url": "borderlandbeat.com",
    "likes": "226"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(n => n.title);
  expect(titles).toContain(
    'Borderland Beat'
  );
})

test('blog without title is not added', async () => {
  const newBlog = {
    "author": "Big Ghost LTD.",
    "url": "http://bigghostnahmean.blogspot.com/",
    "likes": "1000"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
})

// -----

afterAll(async () => {
  await mongoose.connection.close();
})
