import { useState } from "react";

const BlogForm = ({ addBlog, setInfo, setError, setBlogOn }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((newBlog) => ({ ...newBlog, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog(newBlog)
      .then((res) => {
        setInfo(`A new blog ${newBlog.title} by ${newBlog.author} added`);
        setNewBlog({ title: "", author: "", url: "" });
      })
      .catch((error) => {
        setError({
          state: true,
          message: error.response.data.error,
        });
        setTimeout(() => {
          setError({ state: false, message: "" });
        }, 5000);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new</h2>
      <div>
        <label htmlFor="title">Title:</label>{" "}
        <input name="title" value={newBlog.title} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>{" "}
        <input name="author" value={newBlog.author} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="url">URL:</label>{" "}
        <input name="url" value={newBlog.url} onChange={handleChange} />
      </div>
      <button type="submit">Create</button>
      <button onClick={() => setBlogOn(false)}>Cancel</button>
    </form>
  );
};

export default BlogForm;
