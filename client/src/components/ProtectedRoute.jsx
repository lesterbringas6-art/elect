import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading, isAdmin } = useAuth();

  // Wait for the useEffect in AuthContext to finish checking localStorage
  if (isLoading) return null; 

  // If not logged in, kick them to login
  if (!user) return <Navigate to="/login" replace />;

  // If page is admin-only and they aren't an admin, kick them to home
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />; // Render the child routes
};

export default ProtectedRoute;