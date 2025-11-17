import { useEffect, useState, useRef } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import type { GoogleProfile } from '../types/google-auth';

interface GoogleSignInButtonProps {
  clientId: string;
  onSuccess?: (profile: GoogleProfile) => void;
  onError?: (error: string) => void;
  className?: string;
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  clientId,
  onSuccess,
  onError,
  className = '',
  text = 'signin_with',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleButtonReady, setIsGoogleButtonReady] = useState(false);
  const hiddenButtonRef = useRef<HTMLDivElement>(null);

  const handleSuccess = (profile: GoogleProfile) => {
    setIsLoading(false);
    setError(null);
    onSuccess?.(profile);
  };

  const handleError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const { renderGoogleButton, initializeGoogleAuth } = useGoogleAuth({
    clientId,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleClick = () => {
    if (isGoogleButtonReady) {
      setIsLoading(true);
      // Find the hidden Google button and click it
      const googleButton = hiddenButtonRef.current?.querySelector('[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      } else {
        setIsLoading(false);
        setError('Google Sign-In is not ready. Please try again.');
      }
    }
  };

  const getButtonText = () => {
    switch (text) {
      case 'signin_with':
        return 'Sign in with Google';
      case 'signup_with':
        return 'Sign up with Google';
      case 'continue_with':
        return 'Continue with Google';
      case 'signin':
        return 'Google';
      default:
        return 'Sign in with Google';
    }
  };

  useEffect(() => {
    initializeGoogleAuth();
  }, [initializeGoogleAuth]);

  // Render the hidden Google button after initialization
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hiddenButtonRef.current && window.google) {
        renderGoogleButton('hidden-google-button', {
          theme: 'filled_black',
          size: 'large',
          text: text,
          shape: 'rectangular',
        });
        setIsGoogleButtonReady(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [renderGoogleButton, text]);

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-300">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Google Sign-In Error</p>
          </div>
          <p className="text-xs text-red-200 mt-1">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-3 text-xs text-red-300 hover:text-red-200 underline hover:no-underline transition duration-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden Google Button - this provides the actual OAuth functionality */}
      <div 
        ref={hiddenButtonRef}
        id="hidden-google-button" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      />
      
      {/* Custom Button - this is what users see and interact with */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || !isGoogleButtonReady}
        className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
            <span className="text-white font-medium">Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-white font-medium">{getButtonText()}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default GoogleSignInButton;