const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
// const Blog = require('../models/blog');

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs listed', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test("the first blog is about PG's Essays", async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe("PG's Essays")
})

afterAll(async () => {
  await mongoose.connection.close()
})