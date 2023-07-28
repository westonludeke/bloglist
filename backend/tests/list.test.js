const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ];

  const listWithThreeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React is Awesome',
      author: 'John Smith',
      url: 'http://www.example.com/react-awesome',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f7',
      title: 'JavaScript Basics',
      author: 'Jane Doe',
      url: 'http://www.example.com/js-basics',
      likes: 3,
      __v: 0,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('when list has three blogs, equals the sum of their likes', () => {
    const result = listHelper.totalLikes(listWithThreeBlogs);
    expect(result).toBe(18);
  });
});

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ];

  const listWithThreeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React is Awesome',
      author: 'John Smith',
      url: 'http://www.example.com/react-awesome',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f7',
      title: 'JavaScript Basics',
      author: 'Jane Doe',
      url: 'http://www.example.com/js-basics',
      likes: 3,
      __v: 0,
    },
  ];

  test('when list has only one blog, it is the favorite', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when list has three blogs, it finds the favorite', () => {
    const result = listHelper.favoriteBlog(listWithThreeBlogs);
    expect(result).toEqual({
      title: 'React is Awesome',
      author: 'John Smith',
      likes: 10,
    });
  });

  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeNull();
  });
});

