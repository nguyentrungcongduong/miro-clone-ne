import { useAuthStore } from '@/stores/auth';

export default async function authMiddleware(to, from, next) {
  const authStore = useAuthStore();
  
  // If auth hasn't been initialized yet, wait for it
  if (!authStore.authReady) {
    try {
      await authStore.init();
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Continue with the check even if init fails
    }
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthPage = to.matched.some(record => record.meta.isAuthPage);

  // If the route requires authentication and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page with the original URL as a query parameter
    next({
      name: 'login',
      query: { 
        redirect: to.fullPath,
        reason: 'auth_required'
      }
    });
    return;
  }

  // If user is authenticated but trying to access an auth page (like login/register)
  if (isAuthPage && authStore.isAuthenticated) {
    // Redirect to home or the originally requested page
    next({ 
      name: to.query.redirect ? undefined : 'home',
      path: to.query.redirect
    });
    return;
  }

  // Check if the token is expired but we have a refresh token
  if (requiresAuth && authStore.isAuthenticated) {
    const tokenExpiry = parseInt(localStorage.getItem('token_expiry') || '0');
    const tokenWillExpireSoon = tokenExpiry && (tokenExpiry - Date.now() < 5 * 60 * 1000); // 5 minutes
    
    if (tokenWillExpireSoon) {
      try {
        await authStore.refreshAccessToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, log the user out
        await authStore.logout();
        next({ 
          name: 'login',
          query: { 
            redirect: to.fullPath,
            reason: 'session_expired'
          }
        });
        return;
      }
    }
  }

  // All checks passed, proceed to the route
  next();
}

// Helper function to get the redirect path from the query or return to home
export function getRedirectPath(route) {
  return route.query.redirect || { name: 'home' };
}
