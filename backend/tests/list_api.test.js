const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(6)
})

test('the first blog is about PG\'s Essays', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('PG\'s Essays')
})

afterAll(async () => {
  await mongoose.connection.close()
})