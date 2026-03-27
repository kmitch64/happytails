
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';


export default function DefaultHeader({ path }: { path?: string }) {

  const
    title = "Happy Tails",
    { isLoggedIn, user, logout } = useAuth(),
    navigate = useNavigate(),

    handleLogout = () => {
      logout();
      navigate('/');
    };

  if (path?.includes('/admin')) {
    return null;
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img src="/favicon-180.png" width={50} alt="Happy Tails Logo" className="logo-image" />
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
  );

};

