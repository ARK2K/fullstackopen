import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlogs, setNewBlogs] = useState({ title: "", author: "", url: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = newBlogs;
    blogService.create(blogObject).then((res) => {
      setBlogs([...blogs, res]);
      setNewBlogs({ title: "", author: "", url: "" });
    });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <div>
        username{" "}
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{" "}
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlogs((newBlogs) => ({ ...newBlogs, [name]: value }));
  };

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">Title:</label>{" "}
        <input name="title" value={newBlogs.title} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>{" "}
        <input name="author" value={newBlogs.author} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="url">URL:</label>{" "}
        <input name="url" value={newBlogs.url} onChange={handleChange} />
      </div>
      <button type="submit">Create</button>
    </form>
  );

  return (
    <>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h1>blogs</h1>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <div>
            <h2>Create new</h2>
            {blogForm()}
          </div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </>
  );
};

export default App;