
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
// import MetaData from '../../components/metadata/MetaData.jsx';

import './logout.css';
import Loading from '../../components/loader/Loading';


export default function Logout() {

  const [error, setError] = useState(''),
    [isLoading, setIsLoading] = useState(false),
    { logout } = useAuth(),
    navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { success, message } = await logout();
      if (success) {
        navigate('/');
      }
      else {
        setError(message);
      };
    }
    catch (e) {
      console.error('Logout failed:', e);
      setError('An error occurred during logout. Please try again.');
    }
    finally {
      setIsLoading(false);
    };
  };

  return (
    <div className="page">
      {/* <MetaData currentPath="/logout" /> */}
      <div className="page-container">
        <div className="card card-650 card-hover">
          <h1 className="section-title">Logout</h1>
          <p className="section-subtitle">
            Are you sure you want to log out of your account?
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="logout-buttons">
            <button
              onClick={handleLogout}
              className="logout-button"
              disabled={isLoading}
            >
              {isLoading ? <Loading message="Logging out..." /> : 'Logout'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
