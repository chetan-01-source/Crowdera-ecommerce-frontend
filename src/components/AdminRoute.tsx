import { Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentUser } from '../store/authSlice';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);
  const fetchAttempted = useRef(false);
  
  // Fetch user data only once when needed
  useEffect(() => {
    if (isAuthenticated && !user && !loading && !fetchAttempted.current) {
      fetchAttempted.current = true;
      dispatch(getCurrentUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, loading]); // dispatch is stable from Redux Toolkit

  // Reset fetch attempt flag when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      fetchAttempted.current = false;
    }
  }, [isAuthenticated]);

  // If not authenticated (no token), redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there's an authentication error, redirect to login
  if (error && error.includes('token') || error && error.includes('auth')) {
    return <Navigate to="/login" replace />;
  }  // If authenticated but no user data, show loading (don't redirect immediately)
  // This handles the case where we have a token but need to fetch user data
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading User Data</h2>
            <p className="text-gray-400">
              Please wait while we load your account information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and we have user data but not admin, show access denied message
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-6">
              You don't have permission to access this page. Admin access required.
            </p>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Current Role:</span> {user.role || 'Unknown'}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Required Role:</span> admin
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and admin (or still loading user data), render the protected component
  return <>{children}</>;
};

export default AdminRoute;