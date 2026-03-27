<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Import all layouts
import AppLayout from './AppLayout.vue';
import AuthLayout from './AuthLayout.vue';
import ErrorLayout from './ErrorLayout.vue';

const route = useRoute();

// Default layout is AppLayout
const layout = computed(() => {
  const layoutName = route.meta.layout || 'default';
  
  switch (layoutName) {
    case 'auth':
      return AuthLayout;
    case 'error':
      return ErrorLayout;
    case 'none':
      return 'div'; // Render without any layout
    case 'default':
    default:
      return AppLayout;
  }
});
</script>
