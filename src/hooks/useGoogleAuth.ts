import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { registerUser, loginUser } from '../store/authSlice';
import type { GoogleCredentialResponse, GoogleProfile } from '../types/google-auth';

interface UseGoogleAuthProps {
  clientId: string;
  onSuccess?: (user: GoogleProfile, isNewUser?: boolean) => void;
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
        const googlePassword = `G${profile.sub}g123!`;

        // Try to login first
        try {
          await dispatch(loginUser({
            email: profile.email,
            password: googlePassword
          })).unwrap();
          // Login successful - existing user
          console.log('Google OAuth: Existing user login successful');
          onSuccess?.(profile, false);
          return; // Exit here since login was successful
        } catch (loginError) {
          // Login failed, will try registration below
          console.log('Google OAuth: Login failed, attempting registration for new user:', loginError);
        }

        // Registration flow for new users
        try {
          const registerData = {
            email: profile.email,
            password: googlePassword,
            name: profile.name,
            age: 25,
            address: 'Not provided',
            mobileNumber: "8999431754",
            role: 'user'
          };
          
          console.log('Google OAuth: Attempting registration with data:', { email: registerData.email, name: registerData.name });
          await dispatch(registerUser(registerData)).unwrap();
          console.log('Google OAuth: Registration successful, user created in database');
          
          // Registration successful - new user is now created and logged in
          onSuccess?.(profile, true);
        } catch (registerError) {
          console.error('Google OAuth: Registration failed:', registerError);
          onError?.(registerError instanceof Error ? registerError.message : 'Failed to create user account');
        }
      } catch (error) {
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