import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ setBlogs, setInfo, setIsOn, setBlogOn }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
  };

  const addBlog = (event) => {
    event.preventDefault();
    blogService.create(newBlog).then((res) => {
      setBlogs((prevBlogs) => [...prevBlogs, res]);
      setNewBlog({ title: "", author: "", url: "", likes: "" });
      setIsOn(true);
      setTimeout(() => setIsOn(false), 5000);
      setInfo(`A new blog ${newBlog.title} by ${newBlog.author} added`);
      setBlogOn(false);
    });
  };

  return (
    <form onSubmit={addBlog} className="new-blog-form">
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
      <div>
        <label htmlFor="likes">Likes:</label>
        <input
          name="likes"
          type="number"
          value={newBlog.likes}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create</button>
      <button type="button" onClick={() => setBlogOn(false)}>
        Cancel
      </button>
    </form>
  );
};

export default BlogForm;
