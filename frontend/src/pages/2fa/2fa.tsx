
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext.js';
// import MetaData from '../../components/metadata/MetaData.jsx';


export default function TwoFactorAuth() {

  const
    { verify2FA } = useAuth(),
    [code, setCode] = useState(''),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(false),
    navigate = useNavigate(),
    location = useLocation(),
    { email }: { email: string } = location.state || {};

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    };
    setLoading(true);

    try {
      const success = await verify2FA(email, code);
      if (success) {
        navigate('/dashboard');
      }
      else {
        setError('Invalid code. Please try again.');
      };
    }
    catch (e: any) {
      setError(e.message || 'An error occurred. Please try again.');
    }
    finally {
      setLoading(false);
    };
  };

  return (
    <div className="page">
      {/* <MetaData currentPath="/2fa" /> */}
      <div className="card card-650 card-hover">
        <h1 className="section-title">Two-Factor Authentication</h1>
        {error && <div className="error-text error-message">{error}</div>}
        <p className="section-subtitle">
          Enter the 6-digit code from your authenticator app.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              className="form-input"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || code.length !== 6}
          >
            {loading ? <div className="auth-spinner"></div> : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};
