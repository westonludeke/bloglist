require('dotenv').config();
const mongoose = require('mongoose');

if (process.argv.length<3) {
  console.log('give password as argument');
  process.exit(1);
}

// const password = process.argv[2];

const url = process.env.MONGO_DB_URL;

mongoose.set('strictQuery',false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

Blog.find({}).then(result => {
  console.log('blogroll: ');
  result.forEach(blog => {
    console.log(`"${blog.title}" by ${blog.author}`);
  })
  mongoose.connection.close();
});

// blog.save().then(result => {
//   console.log(`added "${blog.title}" by ${blog.author} to blog list`);
//   mongoose.connection.close();
// });

