import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Layout = () => {
  const location = useLocation();
  const hideSidebar = ['/login', '/signup'].includes(location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ 
        flex: 1, 
        marginLeft: !hideSidebar ? '250px' : '0', 
        width: '100%',
        overflowX: 'hidden'
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
