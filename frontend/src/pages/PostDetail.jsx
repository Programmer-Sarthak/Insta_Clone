import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/like/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setPost({ ...post, likes: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/comment/${id}`, 
        { text: comment },
        { headers: { 'x-auth-token': token } }
      );
      // Update comments list instantly
      setPost({ ...post, comments: res.data });
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="detail-container">
      <div className="post-card">
        <h3>{post.user.username}</h3>
        <img src={post.image} alt="post" className="post-image" />
        <p className="caption">{post.caption}</p>
        
        <div className="post-actions">
          <button onClick={handleLike} className={post.likes.includes(userId) ? 'liked' : ''}>
             {post.likes.includes(userId) ? '❤️' : '🤍'} {post.likes.length} Likes
          </button>
        </div>

        <div className="comments-section">
          <h4>Comments</h4>
          {post.comments.map(c => (
            <div key={c._id} className="comment">
              <b>{c.user.username}:</b> {c.text}
            </div>
          ))}
          
          <form onSubmit={handleComment} className="comment-form">
            <input 
              type="text" 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="Add a comment..." 
              required
            />
            <button type="submit">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;