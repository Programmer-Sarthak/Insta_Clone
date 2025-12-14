import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setUser(userRes.data);

        const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, token]);

  const handleFollow = async () => {
    const action = user.followers.includes(currentUserId) ? 'unfollow' : 'follow';
    try {
      await axios.put(`http://localhost:5000/api/users/${action}/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ flexGrow: 1 }}>{user.username}</h2>
        {id !== currentUserId && (
          <button onClick={handleFollow}>
            {user.followers.includes(currentUserId) ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <span>{posts.length} Posts</span>
        <span>{user.followers.length} Followers</span>
        <span>{user.following.length} Following</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {posts.map(post => (
          <img key={post._id} src={post.image} alt="post" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
        ))}
      </div>
    </div>
  );
}

export default Profile;