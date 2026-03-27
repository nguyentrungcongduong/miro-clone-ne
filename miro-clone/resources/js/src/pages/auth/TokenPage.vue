






<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAccessTokenAndRefreshToken } from './actions/getToken';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const error = ref('');

const codeVerifier = route.query?.code_verifier as string;
const userId = route.query?.user_id as string;
const authCode = route.query?.code as string;
const state = route.query?.state as string;

// Handle the OAuth callback
const handleOAuthCallback = async () => {
    try {
        // Log the received parameters (safely)
        console.log('Received OAuth callback with parameters:', {
            hasCodeVerifier: !!codeVerifier,
            hasUserId: !!userId,
            hasAuthCode: !!authCode,
            hasState: !!state
        });

        // Validate required parameters
        if (!codeVerifier || !userId || !authCode) {
            const missing = [];
            if (!codeVerifier) missing.push('code_verifier');
            if (!userId) missing.push('user_id');
            if (!authCode) missing.push('code');
            
            throw new Error(`Missing required parameters: ${missing.join(', ')}`);
        }

        // Exchange the authorization code for tokens
        await getAccessTokenAndRefreshToken(codeVerifier, userId, authCode);
        
        // Redirect to the home page after successful authentication
        router.push({ name: 'home' });
    } catch (err) {
        console.error('Token exchange error:', err);
        error.value = err.message || 'Failed to authenticate. Please try again.';
        
        // Redirect to login after a delay
        setTimeout(() => {
            router.push({ 
                name: 'login',
                query: { 
                    error: encodeURIComponent(error.value)
                } 
            });
        }, 3000);
    } finally {
        isLoading.value = false;
    }
};

// Handle the OAuth callback when the component mounts
onMounted(() => {
    handleOAuthCallback();
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Loading State -->
            <div v-if="isLoading" class="bg-white rounded-xl shadow-xl p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 class="text-xl font-semibold text-slate-800 mb-2">Signing you in</h2>
                <p class="text-slate-600">Please wait while we authenticate your account...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="bg-white rounded-xl shadow-xl p-8">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 class="text-lg font-medium text-slate-900 mb-2">Authentication Failed</h2>
                    <p class="text-sm text-slate-600 mb-6">{{ error }}</p>
                    <p class="text-sm text-slate-500">You will be redirected to the login page shortly...</p>
                </div>
            </div>
        </div>
    </div>
</template>
