import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { registerUser, loginUser } from '../store/authSlice';
import type { GoogleCredentialResponse, GoogleProfile } from '../types/google-auth';

interface UseGoogleAuthProps {
  clientId: string;
  onSuccess?: (user: GoogleProfile) => void;
  onError?: (error: string) => void;
}

export const useGoogleAuth = ({ clientId, onSuccess, onError }: UseGoogleAuthProps) => {
  const dispatch = useAppDispatch();

  // Decode JWT token from Google
  const decodeGoogleToken = (token: string): GoogleProfile | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as GoogleProfile;
    } catch (error) {
      console.error('Error decoding Google token:', error);
      return null;
    }
  };

  // Handle successful Google authentication
  const handleGoogleSuccess = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const profile = decodeGoogleToken(response.credential);
        if (!profile) {
          onError?.('Failed to decode Google token');
          return;
        }

     

        // Generate consistent password for Google users
        const googlePassword = `G${profile.sub}g1`;

        // First, try to login the user (in case they already exist)
        try {
          const loginResult = await dispatch(loginUser({
            email: profile.email,
            password: googlePassword
          })).unwrap();
          console.log('Login successful for existing user:', loginResult);
          
         
          onSuccess?.(profile);
          return;
        } catch (loginError) {
          console.error('Login failed, user might not exist. Attempting registration...', loginError);
          
          // If login fails, try to register the user
          try {
            const registerData = {
              email: profile.email,
              password: googlePassword,
              name: profile.name,
              age: 25, // Default age since Google doesn't provide this
              address: 'Not provided', // Default address
              mobileNumber: "8999431754", // Default mobile number
              role: 'user' // Default role
            };

            const registerResult = await dispatch(registerUser(registerData)).unwrap();
            console.log('Registration successful:', registerResult);
            onSuccess?.(profile);
          } catch (registerError) {
            console.error('Both login and registration failed:', registerError);
            onError?.(registerError instanceof Error ? registerError.message : 'Google authentication failed');
          }
        }
      } catch (error) {
        console.error('Google authentication error:', error);
        onError?.(error instanceof Error ? error.message : 'Google authentication failed');
      }
    },
    [dispatch, onSuccess, onError]
  );

  // Initialize Google OAuth
  const initializeGoogleAuth = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }, [clientId, handleGoogleSuccess]);

  // Initialize when component mounts or when Google scripts load
  useEffect(() => {
    // Check if Google scripts are already loaded
    if (window.google) {
      initializeGoogleAuth();
    } else {
      // Wait for Google scripts to load
      const checkGoogleLoaded = () => {
        if (window.google) {
          initializeGoogleAuth();
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
    }
  }, [initializeGoogleAuth]);

  // Render Google Sign-In button
  const renderGoogleButton = useCallback(
    (elementId: string, config = {}) => {
      const element = document.getElementById(elementId);
      if (element && window.google) {
        window.google.accounts.id.renderButton(element, {
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '100%',
          ...config,
        });
      }
    },
    []
  );

  // Trigger Google One Tap
  const triggerOneTap = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  }, []);

  return {
    renderGoogleButton,
    triggerOneTap,
    initializeGoogleAuth,
  };
};