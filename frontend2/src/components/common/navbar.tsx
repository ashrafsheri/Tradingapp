import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/navbar.css';

const MainNavbar: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); 
  const isLoggedIn = !!localStorage.getItem('token'); 

  const handleLogout = () => {
    fetch('/users/logout', { method: 'GET' })
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); 
        navigate('/login');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <nav>
      <div className="left-menu">
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/browse">Browse</Link></li>
          {isLoggedIn && username && (
            <li><Link to={`/profile/${username}`}>Profile</Link></li> 
          )}
        </ul>
      </div>
      <div className="right-menu">
        {isLoggedIn ? (
          <ul>
            <li>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', padding: '14px 16px', cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
