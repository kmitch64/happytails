
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext.js';
// import MetaData from '../../components/metadata/MetaData.jsx';

import './login.css';

export default function Login() {

  const
    [formData, setFormData] = useState({
      email: '',
      password: ''
    }),
    [error, setError] = useState(''),
    [isLoading, setIsLoading] = useState(false),

    { login } = useAuth(),
    navigate = useNavigate(),

    handleChange = (e: any) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },

    handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const { success, message, requires2FA, userEmail } = await login(formData.email, formData.password);
        if (success) {
          if (requires2FA) {
            navigate('/2fa', { state: { email: userEmail, from: '/login' } });
          }
          else {
            navigate('/dashboard');
          };
        }
        else {
          setError(message);
          setIsLoading(false);
        };
      }
      catch (e: any) {
        setError(e.message);
        setIsLoading(false);
      };
    };

  return (
    <div className="page">
      {/* <MetaData currentPath="/login" /> */}
      {/* <div className="page-container"> */}
        <div className="card card-650 card-hover">
          <h1 className="section-title">Login</h1>

          {error
            ? <div className="error-text error-message">{error}</div>
            : <p className="section-subtitle">
              Welcome back! Please enter your credentials.
            </p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? <div className="auth-spinner"></div> : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};
