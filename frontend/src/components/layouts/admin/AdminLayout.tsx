
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
      <div className="admin-header">
        <button
          onClick={() => navigate('/dashboard')}
          title="Back to User Dashboard"
          style={
            { //this should go to a class
              border: 'none',
              backgroundColor: 'transparent',
              color: '#084168',
              fontSize: '18px'
            }
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} className="admin-icon"/>
          Back to User Dashboard
        </button>

        <h1 className="admin-title">
          <FontAwesomeIcon icon={faUserShield} className="admin-icon" />
          Admin Dashboard
        </h1>
      </div>

      <div className="admin-content-wrapper">
        <div className="admin-sidebar">
          <AdminMenu />
        </div>

        <div className="admin-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

