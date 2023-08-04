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

async function registerAndLoginUser(username, password) {
  const newUser = {
    username,
    name: 'Test User',
    password,
  };

  await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/);

  const response = await api.post('/api/login').send({ username, password });
  return response.body.token;
}

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      "title": "Split Zone Duo",
      "author": "Steven Godrey, Richard Johnson, Alex Kirshner",
      "url": "splitzoneduo.com",
      "likes": "1337"
    };

    const token = await registerAndLoginUser('testuser', 'testpassword');

    const blogsAtStart = await helper.blogsInDb();
    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token}`).expect(201).expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('Split Zone Duo');
  });

  test('a blog without likes can be added', async () => {
    const newBlog = {
      "title": "Dispatches From a Collapsing State",
      "author": "by: Jared Yates Sexton",
      "url": "https://jaredyatessexton.substack.com"
    };

    const token = await registerAndLoginUser('testuser2', 'testpassword2');

    const blogsAtStart = await helper.blogsInDb();
    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token}`).expect(201).expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('Dispatches From a Collapsing State');
  });

  test('blog without title is not added', async () => {
    const newBlog = {
      "author": "Matt Stoller.",
      "url": "https://www.thebignewsletter.com",
      "likes": "404"
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('blog without URL is not added', async () => {
    const newBlog = {
      "title": "The Column",
      "author": "Adam Johnson",
      "likes": "1000"
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});


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

  test('creation fails if username already taken', async () => {
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

  test('creation fails if username less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'wl',
      name: 'WL',
      password: 'hello_world',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toMatch(/Path `username`.*shorter than the minimum allowed length/);

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
})
