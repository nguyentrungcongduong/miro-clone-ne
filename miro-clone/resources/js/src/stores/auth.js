import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const accessToken = ref(localStorage.getItem('access_token') || null);
  const refreshToken = ref(localStorage.getItem('refresh_token') || null);
  const isAuthenticated = computed(() => !!accessToken.value);
  const authReady = ref(false);

  // Check if token is expired
  const isTokenExpired = () => {
    const token = accessToken.value;
    if (!token) return true;
    
    try {
      const [, payload] = token.split('.');
      const { exp } = JSON.parse(atob(payload));
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Set tokens in state and localStorage
  const setTokens = ({ accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn }) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    
    // Store in localStorage
    if (newAccessToken) {
      localStorage.setItem('access_token', newAccessToken);
      
      // Set expiry time (default to 1 hour if not provided)
      const expiresInMs = (expiresIn || 3600) * 1000;
      const expiryTime = Date.now() + expiresInMs;
      localStorage.setItem('token_expiry', expiryTime.toString());
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiry');
    }
    
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
  };

  // Set user data
  const setUser = (userData) => {
    user.value = userData;
  };

  // Fetch current user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      user.value = response.data;
      return user.value;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  // Login with email/password
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      setTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in
      });
      
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Revoke the token on the server if possible
      if (accessToken.value) {
        try {
          await axios.post('/api/logout');
        } catch (error) {
          console.warn('Failed to revoke token on server:', error);
        }
      }
      
      // Clear auth state
      user.value = null;
      setTokens({ accessToken: null, refreshToken: null });
      
      // Redirect to login
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await axios.post('/api/refresh-token', {
        refresh_token: refreshToken.value
      });
      
      setTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken.value,
        expiresIn: response.data.expires_in
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, log the user out
      await logout();
      throw error;
    }
  };

  // Initialize auth state
  const init = async () => {
    try {
      if (accessToken.value && !isTokenExpired()) {
        await fetchUser();
      } else if (refreshToken.value) {
        try {
          await refreshAccessToken();
          await fetchUser();
        } catch (error) {
          console.error('Failed to refresh token on init:', error);
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      authReady.value = true;
    }
  };

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    authReady,
    
    // Getters
    isAdmin: computed(() => user.value?.role === 'admin'),
    
    // Actions
    setUser,
    setTokens,
    fetchUser,
    login,
    logout,
    refreshAccessToken,
    init,
  };
});

// Export a composable function for easier use in components
export const useAuth = () => useAuthStore();
