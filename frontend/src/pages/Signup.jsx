import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      // Send signup request
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      // Redirect to login on success
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <h1 className="instagram-logo">Instagram</h1>
        <p className="signup-subtext">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="terms-text">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>

      <div className="auth-box auth-footer">
        <p>
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
