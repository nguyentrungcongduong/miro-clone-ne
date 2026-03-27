console.log('App.js is loading...');

import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './src/App.vue';

console.log('Dependencies imported');

// Import your routes
import routes from './src/routes';
console.log('Routes imported:', routes);

// Create the Vue application
const app = createApp(App);

// Initialize Pinia
const pinia = createPinia();
app.use(pinia);

// Create router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Auto-import base components
const components = import.meta.glob('./src/components/base/*.vue', { eager: true });

Object.entries(components).forEach(([path, definition]) => {
    // Get component name from path
    const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '');
    
    // Register component globally
    app.component(componentName, definition.default || definition);
});

// Use router
app.use(router);

console.log('About to mount the app...');

// Mount the app
const rootElement = document.getElementById('app');
console.log('Root element:', rootElement);

if (!rootElement) {
    console.error('Could not find element with id "app"');
} else {
    app.mount('#app');
    console.log('App mounted successfully');
}
