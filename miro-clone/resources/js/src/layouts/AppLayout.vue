<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-indigo-600">
                Miro Clone
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/dashboard" 
                class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
                exact-active-class="border-indigo-500"
              >
                Dashboard
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div v-if="authStore.isAuthenticated" class="ml-3 relative">
              <div class="flex items-center">
                <span class="mr-2 text-sm text-gray-700">{{ authStore.user?.name || 'User' }}</span>
                <button 
                  @click="toggleUserMenu"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {{ authStore.user?.name?.charAt(0) || 'U' }}
                  </div>
                </button>
              </div>
              
              <!-- Dropdown menu -->
              <div 
                v-if="isUserMenuOpen" 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Your Profile
                </router-link>
                <button
                  @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
            <template v-else>
              <router-link 
                to="/login" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </router-link>
              <router-link 
                to="/register" 
                class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </router-link>
            </template>
          </div>
          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Icon when menu is closed -->
              <svg 
                class="h-6 w-6" 
                :class="{ 'hidden': isMobileMenuOpen, 'block': !isMobileMenuOpen }" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Icon when menu is open -->
              <svg 
                class="h-6 w-6" 
                :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/dashboard" 
            class="border-indigo-500 bg-indigo-50 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="border-indigo-500 bg-indigo-50 text-indigo-700"
            exact-active-class="border-indigo-500"
          >
            Dashboard
          </router-link>
        </div>
        <div v-if="authStore.isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ authStore.user?.name || 'User' }}</div>
              <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email || '' }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link 
              to="/profile" 
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Your Profile
            </router-link>
            <button
              @click="logout"
              class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
        <div v-else class="pt-4 pb-3 border-t border-gray-200">
          <div class="space-y-1">
            <router-link 
              to="/login" 
              class="block w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign in
            </router-link>
            <router-link 
              to="/register" 
              class="block w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white mt-12">
      <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p class="mt-8 text-center text-base text-gray-400">
          &copy; 2023 Miro Clone. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

// Toggle user menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Close menus when clicking outside
const handleClickOutside = (event) => {
  const userMenu = document.getElementById('user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

// Handle logout
const logout = async () => {
  try {
    await authStore.logout();
    // Close menus
    isUserMenuOpen.value = false;
    isMobileMenuOpen.value = false;
    // Redirect to home
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Close mobile menu when route changes
const routeChangeHandler = () => {
  isMobileMenuOpen.value = false;
};

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  router.afterEach(routeChangeHandler);
});

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  // Note: We don't need to remove the route afterEach hook as Vue Router handles this
});
</script>
