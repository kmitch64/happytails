
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import AdminMenu from '../../admin/AdminMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './adminlayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      
      <header className="admin-header">
        <h1 className="admin-title">
          <FontAwesomeIcon icon={faUserShield} className="admin-icon" />
          Admin Dashboard
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          title="Back to User Dashboard"
          style={
            { //this should go to a class
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--light-text)',
              // fontSize: '18px'
            }
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} className="admin-icon" />
          Back to User Dashboard
        </button>
      </header>

      <div className="admin-content-wrapper">

        <AdminMenu />

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

