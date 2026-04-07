import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Index Component
 * * This is a "Redirector" component. It doesn't render any UI.
 * Instead, it evaluates the user's authentication state and role
 * to decide where they should land first.
 */
const Index = () => {
  const { user, isAdmin } = useAuth();

  // 1. If no user is logged in, send them to the registration/login page
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  // 2. If the user is an Admin, send them to the Admin Dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // 3. Otherwise, send the regular user to their personal Dashboard
  return <Navigate to="/" replace />;
};

export default Index;