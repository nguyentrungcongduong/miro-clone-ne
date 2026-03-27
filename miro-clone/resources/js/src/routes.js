import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authMiddleware from './middleware/auth.js';

// Lazy load route components for better performance
const HomePage = () => import('@/pages/HomePage.vue');
const LoginPage = () => import('@/pages/auth/LoginPage.vue');
const RegisterPage = () => import('@/pages/auth/RegisterPage.vue');
const ForgotPasswordPage = () => import('@/pages/auth/ForgotPasswordPage.vue');
const ResetPasswordPage = () => import('@/pages/auth/ResetPasswordPage.vue');
const TokenPage = () => import('@/pages/auth/TokenPage.vue');
const DashboardPage = () => import('@/pages/DashboardPage.vue');
const ProfilePage = () => import('@/pages/ProfilePage.vue');
const SettingsPage = () => import('@/pages/SettingsPage.vue');
const NotFoundPage = () => import('@/pages/errors/NotFoundPage.vue');
const UnauthorizedPage = () => import('@/pages/errors/UnauthorizedPage.vue');

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { 
      title: 'Home',
      layout: 'default',
      public: true,
    },
  },
  
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { 
      title: 'Sign In',
      layout: 'auth',
      isAuthPage: true,
      public: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { 
      title: 'Create Account',
      layout: 'auth',
      isAuthPage: true,
      public: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { 
      title: 'Forgot Password',
      layout: 'auth',
      isAuthPage: true,
      public: true,
    },
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: ResetPasswordPage,
    props: true,
    meta: { 
      title: 'Reset Password',
      layout: 'auth',
      isAuthPage: true,
      public: true,
    },
  },
  {
    path: '/auth/callback',
    name: 'auth.callback',
    component: TokenPage,
    meta: { 
      title: 'Authenticating...',
      layout: 'auth',
      public: true,
    },
  },
  
  // Protected routes - require authentication
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { 
      title: 'Dashboard',
      requiresAuth: true,
      breadcrumb: [{ title: 'Dashboard', disabled: true }],
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { 
      title: 'My Profile',
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', to: { name: 'dashboard' } },
        { title: 'Profile', disabled: true },
      ],
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: { 
      title: 'Settings',
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', to: { name: 'dashboard' } },
        { title: 'Settings', disabled: true },
      ],
    },
  },
  
  // Error pages
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedPage,
    meta: { 
      title: 'Unauthorized',
      layout: 'error',
      public: true,
    },
  },
  
  // 404 - Keep this as the last route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { 
      title: 'Page Not Found',
      layout: 'error',
      public: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return saved position if it exists (browser back/forward navigation)
    if (savedPosition) {
      return savedPosition;
    }
    // Scroll to top for new route
    return { top: 0, behavior: 'smooth' };
  },
});

// Navigation guard to handle authentication
router.beforeEach(async (to, from, next) => {
  // Set page title
  const title = to.meta.title || 'Miro Clone';
  document.title = `${title} | Miro Clone`;
  
  // Apply auth middleware
  await authMiddleware(to, from, next);
});

// Global after each hook
router.afterEach((to, from) => {
  // Reset scroll position for new pages
  if (from && to && from.name !== to.name) {
    window.scrollTo(0, 0);
  }
});

export default router;
