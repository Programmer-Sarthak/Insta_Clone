import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Error signing up');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
      <h2>Signup</h2>
      <input type="text" placeholder="Username" required 
        onChange={e => setFormData({ ...formData, username: e.target.value })} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <input type="email" placeholder="Email" required 
        onChange={e => setFormData({ ...formData, email: e.target.value })} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <input type="password" placeholder="Password" required 
        onChange={e => setFormData({ ...formData, password: e.target.value })} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;