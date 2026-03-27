<template>
  <div class="settings-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
        <p class="text-gray-600 mb-4">Update your profile information and settings.</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :value="user?.email"
              disabled
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              v-model="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            >
          </div>
          
          <div class="pt-2">
            <button 
              @click="updateProfile"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isUpdating"
            >
              <span v-if="isUpdating">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Change Password</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" 
              v-model="currentPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              v-model="newPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              v-model="confirmPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            >
          </div>
          
          <div class="pt-2">
            <button 
              @click="changePassword"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isChangingPassword"
            >
              <span v-if="isChangingPassword">Updating...</span>
              <span v-else>Update Password</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div class="border-t border-red-200 pt-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium">Delete Account</h3>
              <p class="text-sm text-gray-600">Once your account is deleted, all of its resources and data will be permanently removed.</p>
            </div>
            <button 
              @click="confirmDelete = true"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              :disabled="isDeleting"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="confirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-2">Are you sure?</h3>
        <p class="text-gray-600 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="confirmDelete = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button 
            @click="deleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Yes, delete my account</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const name = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isUpdating = ref(false);
const isChangingPassword = ref(false);
const isDeleting = ref(false);
const confirmDelete = ref(false);

// Initialize form with user data
onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name || '';
  }
});

const updateProfile = async () => {
  if (!name.value.trim()) return;
  
  isUpdating.value = true;
  try {
    await authStore.updateProfile({ name: name.value });
    // Show success message
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert(error.message || 'Failed to update profile');
  } finally {
    isUpdating.value = false;
  }
};

const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || newPassword.value !== confirmPassword.value) {
    alert('Please fill in all fields and ensure new passwords match');
    return;
  }
  
  isChangingPassword.value = true;
  try {
    await authStore.changePassword({
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value
    });
    
    // Reset form
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    // Show success message
    alert('Password updated successfully!');
  } catch (error) {
    console.error('Failed to change password:', error);
    alert(error.message || 'Failed to change password');
  } finally {
    isChangingPassword.value = false;
  }
};

const deleteAccount = async () => {
  if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
    return;
  }
  
  isDeleting.value = true;
  try {
    await authStore.deleteAccount();
    // Redirect to home or login page after deletion
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Failed to delete account:', error);
    alert(error.message || 'Failed to delete account');
  } finally {
    isDeleting.value = false;
    confirmDelete.value = false;
  }
};
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
  padding: 1rem 0;
}
</style>
