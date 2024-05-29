import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id, // Assuming `blog.user` is an object
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlog(returnedBlog);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (confirmDelete) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (error) {
        console.error("Error deleting the blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? "Hide" : "View"}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p>
          <button onClick={handleLike}>Like</button>
          <p>{blog.user.name}</p>
          {user && blog.user.username === user.username && (
            <button onClick={handleDelete}>Remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
