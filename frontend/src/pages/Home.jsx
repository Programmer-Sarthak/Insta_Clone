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
      const res = await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      // Update state locally without reload
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <p className="center-text">Please Login to see posts</p>;

  return (
    <div className="feed-container">
      {posts.map(post => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <h4><Link to={`/profile/${post.user._id}`}>{post.user.username}</Link></h4>
          </div>
          <Link to={`/post/${post._id}`}>
            <img src={post.image} alt="post" className="post-image" />
          </Link>
          <div className="post-actions">
            <button onClick={() => handleLike(post._id)} className={post.likes.includes(userId) ? 'liked' : ''}>
              {post.likes.includes(userId) ? '❤️' : '🤍'} {post.likes.length}
            </button>
            <Link to={`/post/${post._id}`} className="comment-link">
              💬 View Comments ({post.comments.length})
            </Link>
          </div>
          <div className="post-caption">
            <p><b>{post.user.username}</b> {post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;