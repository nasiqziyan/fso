import { useEffect, useRef, useState } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const newBlogRef = useRef(null);

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

  const blogForm = () => {
    return (
      <Togglable ref={newBlogRef} buttonLabel="Create new blog">
        <BlogForm
          addBlog={addBlog}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      </Togglable>
    );
  };

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const handleLike = (id, updatedBlog) => {
    setBlogs(blogs.map((b) => (b.id === id ? { ...b, ...updatedBlog } : b)));
  };

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id);
    if (!blogToDelete) return;
    const confirm = window.confirm(
      `Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`,
    );
    if (!confirm) return;
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      setSuccessMessage(`Deleted blog: ${blogToDelete.title}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setErrorMessage("Failed to delete blog");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const blogList = (blogs) => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    return (
      <>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onDelete={handleDelete}
            currentUser={user}
          />
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
          {blogForm()}
          {blogList(blogs)}
        </>
      )}
    </div>
  );
};

export default App;
