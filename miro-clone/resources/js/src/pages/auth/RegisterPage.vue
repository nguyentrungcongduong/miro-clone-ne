<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900">Create your account</h2>
    <p class="mt-2 text-sm text-center text-gray-600">
      Or
      <router-link 
        to="/login" 
        class="font-medium text-indigo-600 hover:text-indigo-500"
      >
        sign in to your existing account
      </router-link>
    </p>

    <div class="mt-8">
      <div class="mt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.name }"
              >
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>
          </div>


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
              >
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>


          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
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
              >
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>


          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div class="mt-1">
              <input
                id="password_confirmation"
                v-model="formData.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="formData.terms"
              type="checkbox"
              required
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms</a>
              and
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
            </label>
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
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
});

const errors = ref({});
const isSubmitting = ref(false);

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
    // Call registration API
    await authStore.register(formData.value);
    
    // Redirect to email verification notice or dashboard
    router.push({ name: 'dashboard' });
  } catch (error) {
    console.error('Registration failed:', error);
    
    // Handle validation errors
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      // Show generic error message
      errors.value.general = error.response?.data?.message || 'Registration failed. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
