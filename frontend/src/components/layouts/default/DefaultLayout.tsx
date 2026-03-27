
import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';


import './default.css';


export default function DefaultLayout() {
  const
    { isLoggedIn, user, logout } = useAuth(),
    navigate = useNavigate(),
    handleLogout = () => {
      logout();
      navigate('/');
    },
    { pathname } = useLocation(),

    title = "Happy Tails";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <h1>{title}</h1>
            </Link>
            <p className="tagline">A unified platform for pet care and adoption</p>
          </div>
          <nav className="auth-nav">
            {isLoggedIn ? (
              <>
                <span className="user-greeting">Welcome, {user?.username || 'User'}!</span>
                <button onClick={() => navigate('/dashboard')} className="nav-button">Dashboard</button>
                <button onClick={handleLogout} className="nav-button logout">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="nav-button login">Login</button>
                <button onClick={() => navigate('/register')} className="nav-button register">Register</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
