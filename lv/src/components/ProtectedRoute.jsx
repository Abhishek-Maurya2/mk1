import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/userStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  // If user is not authenticated, redirect to the authentication page
  // while saving the current location for potential redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/authentication" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children components
  return children;
};

export default ProtectedRoute;