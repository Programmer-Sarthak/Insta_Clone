import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token) {
    return null;
  }

  const isActive = path => location.pathname === path;

  const HomeIcon = ({ active }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const SearchIcon = ({ active }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const CreateIcon = ({ active }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  const ProfileIcon = ({ active }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Instagram</div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <HomeIcon active={isActive('/')} />
          <span>Home</span>
        </Link>

        <Link
          to="/search"
          className={`nav-link ${isActive('/search') ? 'active' : ''}`}
        >
          <SearchIcon active={isActive('/search')} />
          <span>Search</span>
        </Link>

        <Link
          to="/create"
          className={`nav-link ${isActive('/create') ? 'active' : ''}`}
        >
          <CreateIcon active={isActive('/create')} />
          <span>Create</span>
        </Link>

        {userId && (
          <Link
            to={`/profile/${userId}`}
            className={`nav-link ${
              isActive(`/profile/${userId}`) ? 'active' : ''
            }`}
          >
            <ProfileIcon active={isActive(`/profile/${userId}`)} />
            <span>Profile</span>
          </Link>
        )}
      </div>

      <div className="logout-wrapper">
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="nav-link logout-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <LogoutIcon />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
