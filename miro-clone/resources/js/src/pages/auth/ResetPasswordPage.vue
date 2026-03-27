<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900">Reset your password</h2>
    <p class="mt-2 text-sm text-center text-gray-600">
      Enter your new password below.
    </p>

    <div class="mt-8">
      <div v-if="success" class="mb-4 rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Your password has been reset successfully!
            </p>
            <div class="mt-2">
              <router-link 
                to="/login" 
                class="text-sm font-medium text-green-700 hover:text-green-600"
              >
                Go to login page <span aria-hidden="true">&rarr;</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="formData.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.email }"
                :readonly="isSubmitting"
              >
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="formData.password"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.password }"
                :disabled="isSubmitting"
              >
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div class="mt-1">
              <input
                id="password_confirmation"
                v-model="formData.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :disabled="isSubmitting"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
              <span v-else>Reset Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckCircleIcon } from '@heroicons/vue/outline';

const route = useRoute();
const router = useRouter();

const formData = ref({
  email: '',
  token: '',
  password: '',
  password_confirmation: '',
});

const errors = ref({});
const isSubmitting = ref(false);
const success = ref(false);

// Extract token from URL
onMounted(() => {
  formData.value.token = route.params.token;
  
  // If email is provided in the URL, pre-fill it
  if (route.query.email) {
    formData.value.email = route.query.email;
  }
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  // Reset errors
  errors.value = {};
  
  // Validate passwords match
  if (formData.value.password !== formData.value.password_confirmation) {
    errors.value.password = 'Passwords do not match';
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Call reset password API
    // This is a placeholder - replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success state
    success.value = true;
    
    // Auto-redirect to login after a delay
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);
  } catch (error) {
    console.error('Password reset failed:', error);
    
    // Handle validation errors
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else if (error.response?.status === 400) {
      // Handle invalid/expired token
      errors.value.general = error.response.data.message || 'This password reset token is invalid or has expired.';
    } else {
      // Show generic error message
      errors.value.general = error.response?.data?.message || 'Failed to reset password. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
