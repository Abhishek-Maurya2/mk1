import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/userStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserStore(); // Get loading state
  const location = useLocation();

  // Show loading indicator while checking auth status
  if (loading) {
    // Optional: Replace with a proper loading spinner component
    return <div>Loading...</div>; 
  }

  // If not loading and not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/authentication" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;