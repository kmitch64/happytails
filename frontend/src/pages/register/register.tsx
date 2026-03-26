
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
// import MetaData from '../../components/metadata/MetaData.jsx';

import './register.css';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { success, message } = await register(formData.username, formData.email, formData.password);
      if (!success) {
        throw new Error(message || 'Registration failed');
      }
      navigate('/login');
    }
    catch (e: any) {
      console.log("Registration error:", e);
      setIsLoading(false);
      setError(e.message || 'An error occurred during registration. Please try again.');
    };
  };

  return (
    <div className="page">
      {/* <MetaData currentPath="/register" /> */}
      {/* <div className="page-container"> */}
        <div className="card card-650 card-hover">
          <h1 className="section-title">Register</h1>
          <p className="section-subtitle">
            Create your account to get started.
          </p>
          {error && <div className="error-text error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="CollGuyMcFly"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
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
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? <div className="auth-spinner"></div> : 'Register'}
            </button>
          </form>
          <div className="register-footer">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};
