import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/">InstaClone</Link>
      <div>
        {token ? (
          <>
            <Link to="/create" style={{ marginRight: '10px' }}>Create Post</Link>
            <Link to={`/profile/${userId}`} style={{ marginRight: '10px' }}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;