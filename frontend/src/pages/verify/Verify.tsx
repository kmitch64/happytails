
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';


async function sendVerification(uid: string, otp: string): Promise<Response> {
  try {
    const response = await fetch(`/api/v1/users/verify-email/${uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        otp
      })
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new Response('Error sending verification', { status: 400 });
  };
};

export default function Verify() {
  const [isLoginStarted, setIsLoginStarted] = useState(false);
  const { login } = useAuth();

  const { uid } = useParams();
  const navigate = useNavigate();
  // console.log("UID from URL:", uid);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginStarted(true);

    const data = new FormData(event.currentTarget);
    console.log("Form data:", {
      email: data.get('email'),
      password: data.get('password'),
      otp: data.get('otp')
    });
    
    const response = await sendVerification(uid as string, data.get('otp') as string);
    console.log("Verification response:", response);
    if (response.ok) {
      const logRes = await login(data.get('email') as string, data.get('password') as string);
      console.log("Login response after verification:", logRes);
      if (logRes.success) {
        navigate('/dashboard');
      } else {
        console.log(logRes.message);
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-header">
          <h1>Sign in to Verify Your Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="verify-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={isLoginStarted}
            className="verify-button"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};
