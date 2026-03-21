
import { useAuth } from './AuthContext.js';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};
