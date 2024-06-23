import React, { useEffect, useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [blogUser, setBlogUser] = useState(null);

  useEffect(() => {
    let id = blog.user.id !== undefined ? blog.user.id : blog.user;
    if (id) {
      blogService
        .getUserById(id)
        .then((userData) => setBlogUser(userData))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setBlogUser(null); // Set blogUser to null or handle the error in another way
        });
    } else {
      console.log("blog user is not properly defined");
    }
  }, [blog.user]);

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(updatedBlog);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (confirmDelete) {
      removeBlog(blog.id);
    }
  };

  return (
    <div className="blog">
      <p>
        {blog.title} by {blog.author}
      </p>
      <p>Likes: {blog.likes}</p>
      <button onClick={handleLike}>Like</button>
      <p>{blogUser ? blogUser.name : "Loading user..."}</p>
      {user && blogUser && (
        <p>
          User: {user.username}, Blog User: {blogUser.username}
        </p>
      )}
      {user && blogUser && user.username === blogUser.username && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </div>
  );
};

export default Blog;
