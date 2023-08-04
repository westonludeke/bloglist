const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect(200)
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
})

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api.get(`/api/blogs/${blogToView.id}`).expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  })

 test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = new mongoose.Types.ObjectId().toString();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  })

  test('fails with statuscode 404 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';
    await api.get(`/api/notes/${invalidId}`).expect(404);
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      "title": "Techdirt",
      "author": "Mike Masnick",
      "url": "techdirt.com",
      "likes": "1337"
    }

    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword'})

    let token = response.body.token;
    const usersAtEnd = await helper.usersInDb();

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('Techdirt');
  })

  test('a blog without likes can be added', async () => {
    const newBlog = {
      "title": "Stratechery",
      "author": "Ben Thompson",
      "url": "https://stratechery.com"
    }

    const newUser = {
      username: 'testuser2',
      name: 'Test User2',
      password: 'testpassword2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .post('/api/login')
      .send({ username: 'testuser2', password: 'testpassword2' })

    let token = response.body.token;

    const blogsAtStart = await helper.blogsInDb();

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('Stratechery');
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      "author": "Matt Stoller.",
      "url": "https://www.thebignewsletter.com",
      "likes": "404"
    }

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  })

  test('blog without URL is not added', async () => {
    const newBlog = {
      "title": "Daring Fireball",
      "author": "John Gruber",
      "likes": "1000"
    }

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  })

})

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
})
