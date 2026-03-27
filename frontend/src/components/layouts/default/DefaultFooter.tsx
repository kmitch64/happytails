
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';


export default function DefaultFooter({ path }: { path?: string }) {
  const { isLoggedIn } = useAuth(),
    title = "Happy Tails";

  if (!path) return null;
  return (
    <footer className="main-footer">
      <div className="footer-wrapper">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
              <li><Link to="/adopt">Adopt a Pet</Link></li>
              <li><Link to="/sitters">Find a Sitter</Link></li>
              <li><Link to="/dashboard/ai-assistant">AI Care Assistant</Link></li>
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
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>© 2026 {title}. All rights reserved.</p>
      </div>
    </footer>

  );
};

