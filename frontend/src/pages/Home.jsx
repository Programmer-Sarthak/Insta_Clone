import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/posts/feed', {
          headers: { 'x-auth-token': token }
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <p style={{textAlign: 'center', marginTop: '20px'}}>Please Login to see posts</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ddd', margin: '20px 0', padding: '10px' }}>
          <h4><Link to={`/profile/${post.user._id}`}>{post.user.username}</Link></h4>
          <img src={post.image} alt="post" style={{ width: '100%' }} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleLike(post._id)}>
              {post.likes.includes(userId) ? 'Unlike' : 'Like'} ({post.likes.length})
            </button>
            <p><b>{post.user.username}</b> {post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;