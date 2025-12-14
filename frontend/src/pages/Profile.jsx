import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');
  const fileInputRef = useRef(null);

  const profileId = (!id || id === 'undefined') ? currentUserId : id;

  const getImageUrl = (path) => {
    if (!path) return '/assets/default-user.png';
    return path.startsWith('http') ? path : `http://localhost:5000/${path}`;
  };

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${profileId}`, { headers: { 'x-auth-token': token } }),
          axios.get(`http://localhost:5000/api/posts/user/${profileId}`, { headers: { 'x-auth-token': token } })
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [profileId, token]);

  const toggleFollow = async () => {
    if (!user) return;
    const following = user.followers.includes(currentUserId);
    const action = following ? 'unfollow' : 'follow';

    setUser(prev => ({
      ...prev,
      followers: following 
        ? prev.followers.filter(uid => uid !== currentUserId)
        : [...prev.followers, currentUserId]
    }));

    try {
      await axios.put(`http://localhost:5000/api/users/${action}/${profileId}`, {}, { headers: { 'x-auth-token': token } });
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  const updateProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put('http://localhost:5000/api/users/upload-avatar', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      setUser(prev => ({ ...prev, profilePic: res.data.profilePic }));
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  const GridIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );

  if (loading) return <div>Loading...</div>;

  if (!user) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>User not found</h2>
      <p>This usually happens if the link was broken.</p>
      <button onClick={() => navigate(`/profile/${currentUserId}`)}>Go to My Profile</button>
    </div>
  );

  const isOwnProfile = profileId === currentUserId;
  const isFollowing = user.followers.includes(currentUserId);

  return (
    <div className="profile-container" style={{ maxWidth: '935px', margin: '0 auto', padding: '30px 20px' }}>
      <header className="profile-header" style={{ display: 'flex', marginBottom: '44px', alignItems: 'flex-start' }}>
        <div className="profile-pic-wrapper" style={{ flexGrow: 1, marginRight: '30px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={getImageUrl(user.profilePic)} 
            alt="profile" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', cursor: isOwnProfile ? 'pointer' : 'default', border: '1px solid #363636' }}
            onClick={() => isOwnProfile && fileInputRef.current.click()}
            title={isOwnProfile ? "Click to change photo" : ""}
          />
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={updateProfilePic} />
        </div>

        <div className="profile-info" style={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="profile-top" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '400', margin: 0 }}>{user.username}</h2>
            {!isOwnProfile && (
              <button 
                onClick={toggleFollow}
                style={{ padding: '5px 20px', fontWeight: '600', fontSize: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: isFollowing ? '#363636' : '#0095f6', color: 'white' }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <div className="stats-row" style={{ display: 'flex', gap: '40px', fontSize: '16px' }}>
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{user.followers.length}</strong> followers</span>
            <span><strong>{user.following.length}</strong> following</span>
          </div>

          <div>
            <div style={{ fontWeight: '600' }}>{user.username}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>Digital Creator 📸</div>
          </div>
        </div>
      </header>

      <div className="grid-tabs" style={{ borderTop: '1px solid #262626', display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '20px' }}>
        <div className="tab-item active" style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '15px', borderTop: '1px solid white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
          <GridIcon /> POSTS
        </div>
      </div>

      <div className="photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
        {posts.map(post => (
          <Link to={`/post/${post._id}`} key={post._id} style={{ position: 'relative', display: 'block', paddingBottom: '100%', overflow: 'hidden' }}>
            <img src={post.image} alt="post" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="grid-overlay" style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>❤️ {post.likes.length}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>💬 {post.comments.length}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a8a8a8' }}>
          <div style={{ border: '2px solid white', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>📷</div>
          <h1 style={{ fontSize: '28px', color: 'white', fontWeight: '300' }}>No Posts Yet</h1>
        </div>
      )}

      <style>{`
        .photo-grid a:hover .grid-overlay {
          display: flex;
        }
      `}</style>
    </div>
  );
}

export default Profile;
