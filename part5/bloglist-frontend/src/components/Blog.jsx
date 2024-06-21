import React from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlog(returnedBlog);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (error) {
        console.error("Error removing the blog:", error);
      }
    }
  };

  return (
    <div className="blog">
      <h3>
        {blog.title} by {blog.author}
      </h3>
      <p>{blog.url}</p>
      <p>Likes: {blog.likes}</p>
      <button onClick={handleLike}>Like</button>
      {user.username === blog.user.username && (
        <button onClick={handleRemove}>Remove</button>
      )}
    </div>
  );
};

export default Blog;
