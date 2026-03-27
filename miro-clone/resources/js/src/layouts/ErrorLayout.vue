<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
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
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <router-link 
              to="/" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Go back home
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <slot></slot>
        <div class="mt-10 flex justify-center">
          <router-link 
            to="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white mt-12">
      <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p class="text-center text-base text-gray-400">
          &copy; 2023 Miro Clone. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// This layout is intentionally simple and doesn't require any JavaScript
</script>
