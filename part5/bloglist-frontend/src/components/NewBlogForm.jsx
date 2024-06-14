import React, { useState } from "react";
import PropTypes from "prop-types";

const NewBlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          value={newBlog.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          id="author"
          name="author"
          value={newBlog.author}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          id="url"
          name="url"
          value={newBlog.url}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default NewBlogForm;
