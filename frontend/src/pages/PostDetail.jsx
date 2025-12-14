import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const getProfilePic = (path) => path && path !== '' ? path : '/assets/default-user.png';

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, token]);

  const likePost = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/like/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setPost({ ...post, likes: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/comment/${id}`, { text: commentText }, {
        headers: { 'x-auth-token': token }
      });
      setPost({ ...post, comments: res.data });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const HeartIcon = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ed4956" : "none"} stroke={filled ? "#ed4956" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
      <div style={{ maxWidth: '800px', width: '100%', border: '1px solid var(--border-color)', display: 'flex', backgroundColor: 'var(--bg-color)' }}>
        
        <div style={{ flex: 1, minWidth: '400px' }}>
          <img src={post.image} alt="post" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', color: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid var(--border-color)' }}>
            <img src={getProfilePic(post.user.profilePic)} alt="user" style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
            <Link to={`/profile/${post.user._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.user.username}</Link>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>
              <Link to={`/profile/${post.user._id}`} style={{ fontWeight: 600, marginRight: '5px', color: 'var(--text-primary)' }}>{post.user.username}</Link>
              <span>{post.caption}</span>
            </div>
            {post.comments.map((comment, idx) => (
              <div key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>
                <Link to={`/profile/${comment.user.user._id}`} style={{ fontWeight: 600, marginRight: '5px', color: 'var(--text-primary)' }}>{comment.user.username}</Link>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '8px 15px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={likePost} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                <HeartIcon filled={post.likes.includes(userId)} />
              </button>
            </div>
            <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '5px' }}>
              {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </div>
          </div>

          <div style={{ display: 'flex', padding: '10px 15px', borderTop: '1px solid var(--border-color)' }}>
            <input 
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }}
              style={{ flexGrow: 1, padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button
              onClick={addComment}
              disabled={!commentText.trim()}
              style={{ background: 'none', border: 'none', color: 'var(--primary-button)', fontWeight: 600, cursor: 'pointer', opacity: commentText.trim() ? 1 : 0.5 }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
