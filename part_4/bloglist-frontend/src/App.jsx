import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    const user = JSON.parse(loggedUserJSON);
    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      setUser(user);
    } catch {
      setErrorMessage("Username or password incorrect");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedInUser");
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username:
            <input
              type="text"
              value={username}
              onChange={({ target }) => {
                setUsername(target.value);
              }}
            ></input>
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              value={password}
              type="password"
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            ></input>
          </label>
        </div>

        <button type="submit">login</button>
      </form>
    );
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setSuccessMessage(`Added blog: ${title} by ${author}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch {
      setErrorMessage("Unable to upload blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addBlog = () => {
    return (
      <>
        <form onSubmit={handleBlogSubmit}>
          <div>
            <label>
              title:
              <input
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              author:
              <input
                value={author}
                onChange={({ target }) => {
                  setAuthor(target.value);
                }}
              ></input>
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                value={url}
                onChange={({ target }) => {
                  setUrl(target.value);
                }}
              ></input>
            </label>
            <div>
              <button type="submit">Create</button>
            </div>
          </div>
        </form>
      </>
    );
  };

  const blogList = (blogs) => {
    return (
      <>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </>
    );
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>{" "}
          <button onClick={handleLogout}>log out</button>
        </div>
      )}
      {user && (
        <>
          {addBlog()}
          {blogList(blogs)}
        </>
      )}
    </div>
  );
};

export default App;
