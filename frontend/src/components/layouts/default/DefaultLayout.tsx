
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

import './default.css';


export default function DefaultLayout() {
  const
    { isLoggedIn, user, logout } = useAuth(),
    navigate = useNavigate(),

    handleLoginClick = () => navigate('/login'),
    handleLogout = () => {
      logout();
      navigate('/');
    },

    title = "Happy Tails";

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
                <button onClick={handleLoginClick} className="nav-button login">Login</button>
                <button onClick={() => navigate('/register')} className="nav-button register">Register</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        <div className="footer-wrapper"> 
          <div className="footer-content">
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
                <li><Link to="adopt">Adopt a Pet</Link></li>
                <li><Link to="sitters">Find a Sitter</Link></li>
                <li><Link to="ai-assistant">AI Care Assistant</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@happytails.com <br />
              Phone: (123) 456-7890</p>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><Link to="privacy">Privacy Policy</Link></li>
                <li><Link to="terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© 2026 {title}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
