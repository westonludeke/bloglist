const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username:
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
