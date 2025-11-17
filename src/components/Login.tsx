import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/authSlice';
import GoogleSignInButton from './GoogleSignInButton';
import type { GoogleProfile } from '../types/google-auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Check localStorage for existing token and redirect if already authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    
    if (accessToken) {
      // If token exists in localStorage, redirect based on user role
      if (userRole === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/Home'); // Note: using capital H to match your route
      }
      return;
    }

    // Also check Redux state for authentication
    if (isAuthenticated) {
      // Get user role from localStorage if user object isn't available yet
      const storedUserRole = localStorage.getItem('userRole');
      if (user) {
        // User object is available, use it for navigation
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/Home');
        }
      } else if (storedUserRole) {
        // User object not available yet, but we have stored role
        if (storedUserRole === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/Home');
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    // Use the async thunk to handle login
    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (error) {
      // Error is already handled by the rejected case in the slice
      console.error('Login failed:', error);
    }
  };

  const handleGoogleSignIn = (profile: GoogleProfile, isNewUser?: boolean) => {
    console.log('Google Sign In successful:', profile);
    
    if (isNewUser) {
      // Show toast for new user registration
      setToastMessage('User registered successfully! Welcome to Crowdera');
      setShowToast(true);
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }
    
    // Navigation will happen automatically via useEffect when isAuthenticated changes
  };

  const handleGoogleError = (error: string) => {
    console.error('Google Sign In failed:', error);
    // The error is already handled in the GoogleSignInButton component
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-xl flex items-center justify-center mb-4">
            <span className="text-black text-2xl font-bold">C</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome to Crowdera</h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-800">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900 border border-red-700">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-white focus:ring-white border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-white hover:text-gray-300 transition duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}
              onSuccess={handleGoogleSignIn}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              className="w-full"
            />

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-white hover:text-gray-300 transition duration-200">
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;