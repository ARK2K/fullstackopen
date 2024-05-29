import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import "./index.css";

const Notification = ({ message, good }) => {
  if (!message) return null;

  const notificationStyle = good ? "success box" : "error box";
  return <div className={notificationStyle}>{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [info, setInfo] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [blogOn, setBlogOn] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setError({ state: true, message: "Wrong username or password" });
      setTimeout(() => setError({ state: false, message: "" }), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      {error.state && <Notification message={error.message} good={false} />}
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

  return (
    <>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h1>blogs</h1>
          {isOn && <Notification message={info} good={true} />}
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <div>
            {!blogOn ? (
              <button onClick={() => setBlogOn(true)}>New Blog</button>
            ) : (
              <BlogForm
                setBlogs={setBlogs}
                setInfo={setInfo}
                setIsOn={setIsOn}
                setBlogOn={setBlogOn}
              />
            )}
          </div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
          ))}
        </div>
      )}
    </>
  );
};

export default App;
