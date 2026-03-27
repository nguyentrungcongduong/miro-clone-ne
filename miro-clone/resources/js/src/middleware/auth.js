import { useAuthStore } from '@/stores/auth';

export default async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already loaded
  if (!authStore.isInitialized) {
    try {
      await authStore.init();
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
    }
  }

  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Check if the route is only for guests
  const isGuestOnly = to.matched.some(record => record.meta.guestOnly);
  
  // If the route requires authentication and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page with the return url
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
    return;
  }
  
  // If the route is only for guests and user is authenticated
  if (isGuestOnly && authStore.isAuthenticated) {
    // Redirect to home or dashboard
    next({ name: 'dashboard' });
    return;
  }
  
  // If the route is public or user has the required permissions
  next();
};
