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

describe('mostBlogs', () => {
  test('when list has only one blog, return the author with one blog', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'John Doe',
        likes: 5,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'John Doe',
      blogs: 1,
    });
  });

  test('when list has multiple blogs, return the author with the most blogs', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'John Doe',
        likes: 5,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Jane Smith',
        likes: 10,
      },
      {
        _id: '3',
        title: 'Blog 3',
        author: 'John Doe',
        likes: 8,
      },
      {
        _id: '4',
        title: 'Blog 4',
        author: 'Jane Smith',
        likes: 3,
      },
      {
        _id: '5',
        title: 'Blog 5',
        author: 'Jane Smith',
        likes: 2,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Jane Smith',
      blogs: 3,
    });
  });

  test('when list is empty, return null', () => {
    const blogs = [];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toBeNull();
  });
});

describe('mostLikes', () => {
  test('when list has only one blog, return the author with the likes of that blog', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'John Doe',
        likes: 5,
      },
    ];

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'John Doe',
      likes: 5,
    });
  });

  test('when list has multiple blogs, return the author with the most likes', () => {
    const blogs = [
      {
        _id: '1',
        title: 'Blog 1',
        author: 'John Doe',
        likes: 5,
      },
      {
        _id: '2',
        title: 'Blog 2',
        author: 'Jane Smith',
        likes: 10,
      },
      {
        _id: '3',
        title: 'Blog 3',
        author: 'John Doe',
        likes: 8,
      },
      {
        _id: '4',
        title: 'Blog 4',
        author: 'Jane Smith',
        likes: 3,
      },
      {
        _id: '5',
        title: 'Blog 5',
        author: 'Jane Smith',
        likes: 2,
      },
    ];

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Jane Smith',
      likes: 15,
    });
  });

  test('when list is empty, return null', () => {
    const blogs = [];

    const result = listHelper.mostLikes(blogs);
    expect(result).toBeNull();
  });
});

