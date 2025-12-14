import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      navigate('/');
    } catch (err) {
      alert('Login Failed');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" required 
        onChange={e => setFormData({ ...formData, email: e.target.value })} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <input type="password" placeholder="Password" required 
        onChange={e => setFormData({ ...formData, password: e.target.value })} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;