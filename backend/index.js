require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const Blog = require('./modules/blog');
const config = require('./utils/config');

const mongoUrl = process.env.MONGO_DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    response.json(blog)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.put('/api/blogs/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body;
  Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )
   .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
})

// const PORT = process.env.PORT || 3003
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})