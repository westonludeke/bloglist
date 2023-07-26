const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGO_DB_URL;

mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: "PG's Essays",
  author: "Paul Graham",
  url: "http://www.paulgraham.com/articles.html",
  likes: 500
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})