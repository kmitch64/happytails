
import { useAuth } from './AuthContext.js';
import { Navigate } from 'react-router-dom';

import Loading from '../loader/Loading';

export default function ProtectedRoute({ children }: { children: React.ReactNode }  ) {
  const { isLoading, isLoggedIn } = useAuth();
  if (!isLoading) {
  
  return isLoggedIn ? children : <Navigate to="/login" />;
  }
  return (
    <Loading message="Checking access level..." />
  );
};
