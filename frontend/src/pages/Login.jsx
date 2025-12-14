import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);

      if (res.data.user?.id) {
        localStorage.setItem('userId', res.data.user.id);
      }

      navigate('/');
    } catch (err) {
      if (err.response?.data?.msg) {
        setErrorMessage(err.response.data.msg);
      } else {
        setErrorMessage("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <h1 className="instagram-logo">Instagram</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Phone number, username, or email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="primary-btn">Log in</button>
          {errorMessage && <p className="error-msg">{errorMessage}</p>}
        </form>
      </div>

      <div className="auth-box" style={{ padding: '20px', flexDirection: 'row', justifyContent: 'center' }}>
        <p className="switch-link" style={{ margin: 0 }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
 