const formatUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  }
  return url;
};

const Blog = ({ blog, user, handleDelete }) => {
  return (
    <ul key={blog.id} className="blog">
      <p>
        <strong>{blog.title}</strong><br />
        by: {blog.author}<br />
        <a href={formatUrl(blog.url)}>{blog.url}</a><br />
        Likes: {blog.likes}<br />
        { user && (
          <button id="delete" onClick={() => handleDelete(blog.id)}>delete</button>
        )}
      </p>
    </ul>
  );
};

export default Blog;
