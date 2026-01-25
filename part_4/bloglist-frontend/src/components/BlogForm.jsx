import { useState } from "react";

const BlogForm = ({ addBlog, setErrorMessage, setSuccessMessage }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  //   const [formData, setFormData] = useState(null);

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      await addBlog({ title, author, url });
      setTitle("");
      setAuthor("");
      setUrl("");

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

  return (
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
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
