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
      
      // Update local state logic
      let updatedFollowers = [...user.followers];
      if (action === 'follow') {
        updatedFollowers.push(currentUserId);
      } else {
        updatedFollowers = updatedFollowers.filter(uid => uid !== currentUserId);
      }
      setUser({ ...user, followers: updatedFollowers });

    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{user.username}</h2>
        {id !== currentUserId && (
          <button onClick={handleFollow} className={user.followers.includes(currentUserId) ? 'unfollow-btn' : 'follow-btn'}>
            {user.followers.includes(currentUserId) ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <div className="stats">
        <span><b>{posts.length}</b> Posts</span>
        <span><b>{user.followers.length}</b> Followers</span>
        <span><b>{user.following.length}</b> Following</span>
      </div>
      <div className="grid-gallery">
        {posts.map(post => (
          <img key={post._id} src={post.image} alt="post" />
        ))}
      </div>
    </div>
  );
}

export default Profile;