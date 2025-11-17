import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { refreshToken } from '../store/authSlice';

// Token utility functions
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

const willTokenExpireSoon = (token: string, thresholdSeconds: number): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const currentTime = Date.now() / 1000;
  return decoded.exp - currentTime < thresholdSeconds;
};

/**
 * Hook to monitor token expiration and automatically refresh when needed
 */
export const useTokenRefresh = (
  refreshThresholdSeconds: number = 300 // Refresh when token has 5 minutes left
) => {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken: refreshTokenValue, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated || !accessToken || !refreshTokenValue) {
      return;
    }

    // Check if access token is expired or will expire soon
    if (isTokenExpired(accessToken) || willTokenExpireSoon(accessToken, refreshThresholdSeconds)) {

      try {
        await dispatch(refreshToken()).unwrap();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
  }, [dispatch, accessToken, refreshTokenValue, isAuthenticated, refreshThresholdSeconds]);

  // Check token on mount and set up interval
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check immediately
    checkAndRefreshToken();

    // Set up interval to check every minute
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAndRefreshToken, isAuthenticated]);

  // Return function to manually trigger token refresh
  return { refreshTokenManually: checkAndRefreshToken };
};