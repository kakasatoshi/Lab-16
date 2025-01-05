import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Nếu cần token CSRF

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Xử lý thành công (redirect hoặc cập nhật UI)
      console.log('Login successful:', response.data);
    } catch (error) {
      // Hiển thị lỗi
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong!');
      }
    }
  };

  return (
    <div>
      {/* Head Section */}
      <head>
        <link rel="stylesheet" href="/css/forms.css" />
        <link rel="stylesheet" href="/css/auth.css" />
      </head>

     
      <main>
        {errorMessage && (
          <div className="user-message user-message--error">{errorMessage}</div>
        )}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Hidden CSRF Token */}
          <input type="hidden" name="_csrf" value={csrfToken} />
          <button className="btn" type="submit">Login</button>
        </form>
      </main>
    </div>
  );
};

export default LoginForm;
