const loginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label>
        username
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange} // ({ target }) => setUsername(target.value)
        />
      </label>
    </div>
    <div>
      <label>
        password
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange} // ({ target }) => setPassword(target.value)
        />
      </label>
    </div>
    <button type="submit">login</button>
  </form>
);

export default loginForm;
