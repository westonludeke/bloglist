const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogCounts = blogs.reduce((countMap, blog) => {
    countMap[blog.author] = (countMap[blog.author] || 0) + 1;
    return countMap;
  }, {});

  const topAuthor = Object.keys(blogCounts).reduce((a, b) =>
    blogCounts[a] > blogCounts[b] ? a : b
  );

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuthor = {};

  blogs.forEach((blog) => {
    const { author, likes } = blog;
    likesByAuthor[author] = (likesByAuthor[author] || 0) + likes;
  });

  const authorWithMostLikes = Object.keys(likesByAuthor).reduce((prevAuthor, currentAuthor) =>
    likesByAuthor[currentAuthor] > likesByAuthor[prevAuthor] ? currentAuthor : prevAuthor
  );

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes],
  };
};

module.exports = {
  favoriteBlog, totalLikes, mostBlogs, mostLikes,
};

