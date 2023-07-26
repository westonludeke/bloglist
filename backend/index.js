require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const Blog = require('./modules/blog');

const mongoUrl = process.env.MONGO_DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
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

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})