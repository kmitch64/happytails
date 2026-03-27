
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import DefaultFooter from '../../components/layouts/default/DefaultFooter';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaw, faUser, faRobot, faEnvelope,
  faBell, faCog, faCalendarAlt, faCreditCard, faHome,
  faSignOutAlt, faDog, faCat, faSearch, faHeart, faUserShield, faNotesMedical
} from '@fortawesome/free-solid-svg-icons';

import './dashboard.scss';


export default function DashboardLayout() {
  const
    { user, logout } = useAuth(),
    navigate = useNavigate(),
    handleLogout = () => {
      logout();
      navigate('/');
    },
    { pathname } = useLocation();

  return (
    <div className="dashboard-container">

      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          {/* <h2>Happy Tails</h2> */}
          <div className="user-profile">
            <div className="user-avatar">
              {user?.avatar
                ? <img src={user.avatar} alt="User Avatar" />
                : <img src="/images/avatars/no-avatar.png" width={48} alt="Default Avatar" />
              }
            </div>
            <div className="user-info">
              <p className="user-name">{user?.username || 'User'}</p>
              <p className="user-role">{user?.role || 'Pet Lover'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            
            <li>
              <Link to="/dashboard" className="nav-link active">
                <FontAwesomeIcon icon={faHome} />
                <span>Dashboard</span>
              </Link>
            </li>

            {user?.isAdmin && (
              <>
                <li className="nav-section-header">Admin</li>
                <li>
                  <Link to="/dashboard/admin" className="nav-link">
                    <FontAwesomeIcon icon={faUserShield} />
                    <span>Admin Dashboard</span>
                  </Link>
                </li>
              </>
            )}

            <li className="nav-section-header">Pet Care</li>
            <li>
              <Link to="/dashboard/my-pets" className="nav-link">
                <FontAwesomeIcon icon={faPaw} />
                <span>My Pets</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/ai-assistant" className="nav-link">
                <FontAwesomeIcon icon={faRobot} />
                <span>AI Care Assistant</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reminders" className="nav-link">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Care Reminders</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/medical-records" className="nav-link">
                <FontAwesomeIcon icon={faNotesMedical} />
                <span>Medical Records</span>
              </Link>
            </li>

            <li className="nav-section-header">Pet Adoption</li>
            <li>
              <Link to="/dashboard/adopt" className="nav-link">
                <FontAwesomeIcon icon={faSearch} />
                <span>Browse Pets</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/my-applications" className="nav-link">
                <FontAwesomeIcon icon={faPaw} />
                <span>My Applications</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/favorites" className="nav-link">
                <FontAwesomeIcon icon={faHeart} />
                <span>Saved Pets</span>
              </Link>
            </li>

            {(user?.role === 'ShelterStaff' || user?.isAdmin) && (
              <>
                <li className="nav-section-header">Shelter Tools</li>
                <li>
                  <Link to="/dashboard/list-pet" className="nav-link">
                    <FontAwesomeIcon icon={faDog} />
                    <span>List a Pet</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/manage-listings" className="nav-link">
                    <FontAwesomeIcon icon={faCat} />
                    <span>Manage Listings</span>
                  </Link>
                </li>
              </>
            )}
            

            {(user?.role === 'PetSitter' || user?.isAdmin) && (
              <>
                <li className="nav-section-header">Pet Sitting</li>
                <li>
                  <Link to="/dashboard/availability" className="nav-link">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>My Availability</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/bookings" className="nav-link">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>My Bookings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/reviews" className="nav-link">
                    <FontAwesomeIcon icon={faUser} />
                    <span>My Reviews</span>
                  </Link>
                </li>
              </>
            )}

            <li className="nav-section-header">Account</li>
            <li>
              <Link to="/dashboard/messages" className="nav-link">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Messages</span>
                <span className="notification-badge">2</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/notifications" className="nav-link">
                <FontAwesomeIcon icon={faBell} />
                <span>Notifications</span>
                <span className="notification-badge">5</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/subscriptions" className="nav-link">
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Subscriptions</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings" className="nav-link">
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <Outlet />
        <DefaultFooter path={pathname} />
      </div>
    </div>
  );
};
