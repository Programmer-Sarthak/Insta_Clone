import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', 
        { image, caption },
        { headers: { 'x-auth-token': token } }
      );
      navigate('/');
    } catch (err) {
      alert('Error creating post');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <h2>Create Post</h2>
      <input type="text" placeholder="Image URL" required 
        onChange={e => setImage(e.target.value)} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <textarea placeholder="Caption" required 
        onChange={e => setCaption(e.target.value)} 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <button type="submit">Share</button>
    </form>
  );
}

export default CreatePost;