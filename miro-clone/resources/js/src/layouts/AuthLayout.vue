<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo/Branding -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <router-link to="/" class="flex justify-center">
        <div class="text-3xl font-bold text-indigo-600">Miro Clone</div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        <slot name="title">Welcome back</slot>
      </h2>
      <p v-if="!$slots.subtitle" class="mt-2 text-center text-sm text-gray-600">
        <slot name="subtitle">Sign in to your account</slot>
      </p>
    </div>

    <!-- Main Content -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot></slot>
      </div>
      
      <!-- Footer Links -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">
              <slot name="footer-text">Or continue with</slot>
            </span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3">
          <slot name="auth-actions">
            <div v-if="!hideSignup" class="text-center text-sm">
              <span class="text-gray-600">Don't have an account? </span>
              <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </router-link>
            </div>
            <div v-else class="text-center text-sm">
              <span class="text-gray-600">Already have an account? </span>
              <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </router-link>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  hideSignup: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

// Auto-detect if we should hide signup based on current route
const shouldHideSignup = computed(() => {
  return route.path === '/register' || props.hideSignup;
});
</script>
