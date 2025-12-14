import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const getImgUrl = (path) => path && path.startsWith('http') ? path : '/assets/default-user.png';

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/search/${query}`, {
          headers: { 'x-auth-token': token }
        });
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, token]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c7c7c7" stroke="currentColor" strokeWidth="0">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
    </svg>
  );

  return (
    <div className="search-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Search</h2>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#262626',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px 12px 44px',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
          }}
        />
        {query && (
          <div
            onClick={clearSearch}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-45%)', cursor: 'pointer' }}
          >
            <ClearIcon />
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #262626', paddingTop: '10px' }}>
        {loading && <div style={{ color: '#a8a8a8', padding: '10px' }}>Searching...</div>}

        {!loading && query && results.length === 0 && (
          <div style={{ color: '#a8a8a8', padding: '10px' }}>No results found.</div>
        )}

        {!query && results.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>Recent</span>
            <span style={{ color: '#0095f6', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Clear all</span>
          </div>
        )}

        {results.map((user) => (
          <Link
            to={`/profile/${user._id}`}
            key={user._id}
            className="search-result"
            style={{ display: 'flex', alignItems: 'center', padding: '8px 0', textDecoration: 'none', color: 'white' }}
          >
            <img
              src={getImgUrl(user.profilePic)}
              alt="user"
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px' }}
            />
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.username}</div>
              <div style={{ color: '#a8a8a8', fontSize: '14px' }}>
                {user.username} • {user.followers?.length || 0} followers
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Search;
