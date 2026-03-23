import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const PrivateRoute = ({ adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};