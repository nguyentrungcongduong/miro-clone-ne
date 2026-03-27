<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Welcome to Miro Clone</h1>
    <p class="mb-4">You are now logged in!</p>
    <button 
      @click="handleLogout"
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = async () => {
  try {
    // Call your logout API endpoint
    await axios.post('/logout');
    // Redirect to login page
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>
