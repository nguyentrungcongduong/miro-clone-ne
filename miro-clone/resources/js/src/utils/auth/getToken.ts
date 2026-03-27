import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

/**
 * Exchanges an authorization code for access and refresh tokens
 */
export const exchangeCodeForToken = async (
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: any;
}> => {
  try {
    const response = await axios.post('/oauth/token', {
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_PASSPORT_CLIENT_ID,
      client_secret: import.meta.env.VITE_PASSPORT_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    return response.data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
};

/**
 * Refreshes an access token using a refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> => {
  try {
    const response = await axios.post('/oauth/token', {
      grant_type: 'refresh_token',
      client_id: import.meta.env.VITE_PASSPORT_CLIENT_ID,
      client_secret: import.meta.env.VITE_PASSPORT_CLIENT_SECRET,
      refresh_token: refreshToken,
      scope: '',
    });

    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Failed to refresh access token');
  }
};

/**
 * Handles the complete OAuth flow including token exchange and user data retrieval
 */
export const handleOAuthCallback = async (
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: any;
}> => {
  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await exchangeCodeForToken(code, codeVerifier, redirectUri);
    
    // Store tokens in the auth store
    const authStore = useAuthStore();
    authStore.setTokens({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
    });
    
    // Store user data in the auth store
    if (tokenResponse.user) {
      authStore.setUser(tokenResponse.user);
    } else {
      // If user data isn't in the token response, fetch it from the API
      await authStore.fetchUser();
    }
    
    return {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      user: authStore.user,
    };
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};
