import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/feed', {
          headers: { 'x-auth-token': token }
        });
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadPosts();
  }, [token]);

  const likePost = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: response.data } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId) => {
    const text = comments[postId];
    if (!text || !text.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, { text }, {
        headers: { 'x-auth-token': token }
      });
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: response.data } : p));
      setComments(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff}s`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getProfilePic = (path) => path?.startsWith('http') ? path : '/assets/default-user.png';

  const Heart = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ed4956" : "none"} stroke={filled ? "#ed4956" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  return (
    <div className="feed-layout" style={{ width: '100%', minHeight: '100vh', paddingTop: '20px' }}>
      <div className="main-content-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div className="feed-column" style={{ width: '100%', flexGrow: 1 }}>
          {posts.map(post => (
            <div key={post._id} className="post-card" style={{ border: '1px solid var(--border-color)', borderRadius: '3px', marginBottom: '20px', width: '100%', maxWidth: '620px' }}>
              <div className="post-header" style={{ display: 'flex', alignItems: 'center', padding: '14px 16px' }}>
                <img src={getProfilePic(post.user.profilePic)} alt="user" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ marginLeft: '10px' }}>
                  <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {post.user.username}
                  </Link>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '5px' }}>• {timeAgo(post.date)}</span>
                </div>
              </div>

              <img src={post.image} alt="post" style={{ width: '100%', height: 'auto', display: 'block' }} />

              <div className="action-bar" style={{ display: 'flex', padding: '4px 8px' }}>
                <button onClick={() => likePost(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '8px' }}>
                  <Heart filled={post.likes.includes(userId)} />
                </button>
              </div>

              <div style={{ padding: '0 16px 8px', fontSize: '14px', fontWeight: 600 }}>
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </div>

              {post.comments?.length > 0 && (
                <div style={{ padding: '0 16px 8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
                    View all {post.comments.length} comments
                  </Link>
                </div>
              )}

              <div style={{ padding: '0 16px 14px', fontSize: '14px' }}>
                <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)', marginRight: '5px', fontWeight: 600 }}>
                  {post.user.username}
                </Link>
                {post.caption}
              </div>

              <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '10px 16px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comments[post._id] || ''}
                  onChange={(e) => setComments(prev => ({ ...prev, [post._id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') addComment(post._id); }}
                  style={{ flexGrow: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={() => addComment(post._id)}
                  disabled={!comments[post._id]?.trim()}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-button)', fontWeight: 600, cursor: 'pointer', paddingLeft: '10px', opacity: comments[post._id]?.trim() ? 1 : 0.5 }}
                >
                  Post
                </button>
              </div>
            </div>
          ))}

          {posts.length > 0 && (
            <div style={{ textAlign: 'center', padding: '40px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ color: '#ed4956', fontSize: '30px', marginBottom: '10px' }}>✓</div>
              <h2 style={{ fontSize: '20px', fontWeight: '400' }}>You're all caught up</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px' }}>You've seen all new posts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
