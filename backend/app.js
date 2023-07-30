require('dotenv').config();
const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware');
// const Blog = require('./modules/blog');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// const mongoUrl = process.env.MONGO_DB_URL;
mongoose.set('strictQuery', false);
// mongoose.connect(mongoUrl);

mongoose.connect(config.MONGO_DB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// app.get('/api/blogs', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// app.get('/api/blogs/:id', (request, response) => {
//   Blog.findById(request.params.id).then(blog => {
//     response.json(blog)
//   })
// })

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })

// app.delete('/api/blogs/:id', (request, response, next) => {
//   Blog.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// });

// app.put('/api/blogs/:id', (request, response, next) => {
//   const { title, author, url, likes } = request.body;
//   Blog.findByIdAndUpdate(
//     request.params.id,
//     { title, author, url, likes },
//     { new: true, runValidators: true, context: 'query' }
//   )
//    .then(updatedBlog => {
//       response.json(updatedBlog);
//     })
//     .catch(error => next(error));
// })

// // const PORT = process.env.PORT || 3003
// app.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`)
// })

module.exports = app;