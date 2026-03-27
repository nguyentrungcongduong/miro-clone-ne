<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="md:flex md:items-center md:justify-between md:space-x-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your account information and settings
          </p>
        </div>
      </div>

      <div class="mt-8">
        <div class="space-y-6">
          <!-- Profile Information -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Your personal details and contact information.
              </p>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div class="mt-1">
                    <input
                      id="email"
                      type="email"
                      v-model="formData.email"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="avatar" class="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <div class="mt-1 flex items-center">
                    <span class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <img
                        v-if="user?.avatar"
                        :src="user.avatar"
                        alt="User avatar"
                        class="h-full w-full text-gray-300"
                      />
                      <UserCircleIcon v-else class="h-full w-full text-gray-300" />
                    </span>
                    <button
                      type="button"
                      class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                @click="updateProfile"
                :disabled="isUpdating"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdating">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save</span>
              </button>
            </div>
          </div>

          <!-- Change Password -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Change Password
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Update your password.
              </p>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-4">
                  <label for="current-password" class="block text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <div class="mt-1">
                    <input
                      id="current-password"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label for="new-password" class="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <div class="mt-1">
                    <input
                      id="new-password"
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <div class="mt-1">
                    <input
                      id="confirm-password"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                @click="updatePassword"
                :disabled="isUpdatingPassword"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdatingPassword">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Update Password</span>
              </button>
            </div>
          </div>

          <!-- Delete Account -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-red-200 bg-red-50">
              <h3 class="text-lg leading-6 font-medium text-red-800">
                Delete Account
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-red-700">
                Permanently delete your account and all of your data.
              </p>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <p class="text-sm text-gray-600">
                Once your account is deleted, all of its resources and data will be permanently deleted.
                Before deleting your account, please download any data or information that you wish to retain.
              </p>
              <div class="mt-5">
                <button
                  type="button"
                  @click="confirmDelete = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="confirmDelete" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="confirmDelete = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete account
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete your account? All of your data will be permanently removed.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteAccount"
              :disabled="isDeleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isDeleting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
              <span v-else>Delete</span>
            </button>
            <button
              type="button"
              @click="confirmDelete = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              :disabled="isDeleting"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ExclamationIcon } from '@heroicons/vue/outline';

const router = useRouter();
const authStore = useAuthStore();

// User data
const user = ref(null);

// Form data
const formData = reactive({
  name: '',
  email: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// UI state
const isUpdating = ref(false);
const isUpdatingPassword = ref(false);
const confirmDelete = ref(false);
const isDeleting = ref(false);

// Load user data
onMounted(async () => {
  try {
    if (authStore.user) {
      user.value = { ...authStore.user };
      formData.name = user.value.name || '';
      formData.email = user.value.email || '';
    } else {
      // If user data isn't loaded, fetch it
      user.value = await authStore.fetchUser();
      formData.name = user.value.name || '';
      formData.email = user.value.email || '';
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
});

// Update profile
const updateProfile = async () => {
  if (!user.value) return;
  
  isUpdating.value = true;
  
  try {
    // Call API to update profile
    const response = await axios.put('/api/user/profile', {
      name: formData.name,
      email: formData.email,
    });
    
    // Update local user data
    user.value = { ...user.value, ...response.data };
    authStore.setUser(user.value);
    
    // Show success message
    // You might want to use a toast notification here
    alert('Profile updated successfully');
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Show error message
    alert('Failed to update profile. Please try again.');
  } finally {
    isUpdating.value = false;
  }
};

// Update password
const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('New passwords do not match');
    return;
  }
  
  isUpdatingPassword.value = true;
  
  try {
    // Call API to update password
    await axios.post('/api/user/password', {
      current_password: passwordForm.currentPassword,
      password: passwordForm.newPassword,
      password_confirmation: passwordForm.confirmPassword,
    });
    
    // Reset form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    
    // Show success message
    alert('Password updated successfully');
  } catch (error) {
    console.error('Failed to update password:', error);
    // Show error message
    const message = error.response?.data?.message || 'Failed to update password. Please try again.';
    alert(message);
  } finally {
    isUpdatingPassword.value = false;
  }
};

// Delete account
const deleteAccount = async () => {
  if (!confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
    return;
  }
  
  isDeleting.value = true;
  
  try {
    // Call API to delete account
    await axios.delete('/api/user');
    
    // Logout user
    await authStore.logout();
    
    // Redirect to home
    router.push('/');
  } catch (error) {
    console.error('Failed to delete account:', error);
    alert('Failed to delete account. Please try again.');
  } finally {
    isDeleting.value = false;
    confirmDelete.value = false;
  }
};
</script>
