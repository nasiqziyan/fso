import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user && blog.user.id ? blog.user.id : blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      // // If returnedBlog.user is just an id, replace it with the original user object
      if (returnedBlog.user && typeof returnedBlog.user === "string") {
        returnedBlog.user = blog.user;
      }
      if (onLike) onLike(blog.id, returnedBlog);
    } catch {
      // Optionally handle error
    }
  };

  const canDelete = currentUser && blog.user && blog.user.id === currentUser.id;

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {canDelete && (
            <button
              style={{ background: "red", color: "white" }}
              onClick={() => onDelete(blog.id)}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
