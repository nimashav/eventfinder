import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check admin requirement
  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>This page requires administrator privileges.</p>
          <button
            className="back-btn"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
