<?php

use App\Http\Controllers\Auth\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// Debug routes
if (app()->environment('local')) {
    require __DIR__.'/debug.php';
}

// Home route
Route::get('/', function() {
    return view('welcome');
});

// OAuth routes - only accessible to guests
Route::middleware(['web', 'guest'])->group(function () {
    // Google OAuth routes
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])
        ->name('auth.google.redirect');
    
    Route::get('/auth/google/callback', [AuthController::class, 'createUserViaGoogle'])
        ->name('auth.google.callback');

    // Add other OAuth providers here if needed
});

// OAuth callback route for the frontend
Route::get('/app/callback', function (Request $request) {
    Log::debug('Frontend callback route hit', [
        'query_params' => $request->query(),
        'session_id' => session()->getId()
    ]);
    
    // Verify state parameter
    $state = $request->session()->pull('passport_state');
    if (!$state || $state !== $request->state) {
        Log::error('Invalid state parameter', [
            'expected' => $state,
            'actual' => $request->state,
            'session' => $request->session()->all()
        ]);
        return redirect('/login')->with('error', 'Invalid authentication state');
    }

    // Get the authenticated user
    $userId = $request->session()->pull('auth_user_id');
    $user = $userId ? User::find($userId) : Auth::user();
    
    if (!$user) {
        Log::error('User not found during OAuth callback', [
            'user_id' => $userId,
            'session' => $request->session()->all()
        ]);
        return redirect('/login')->with('error', 'User not authenticated');
    }

    // Ensure the user is logged in
    Auth::login($user);
    
    // Get the authorization code and code verifier
    $code = $request->code;
    $codeVerifier = $request->session()->pull('pkce_code_verifier');
    
    if (!$code || !$codeVerifier) {
        Log::error('Missing code or code_verifier', [
            'has_code' => !empty($code),
            'has_code_verifier' => !empty($codeVerifier),
            'session' => $request->session()->all()
        ]);
        return redirect('/login')->with('error', 'Authentication failed: Missing required parameters');
    }

    // Generate the frontend URL with the necessary parameters
    $frontendUrl = env('FRONTEND_URL', 'http://127.0.0.1:8000') . 
        '/app/token?code=' . urlencode($code) .
        '&state=' . urlencode($state) .
        '&code_verifier=' . urlencode($codeVerifier) .
        '&user_id=' . $user->id .
        '&_token=' . csrf_token();

    Log::debug('Redirecting to frontend token handler', [
        'frontend_url' => $frontendUrl,
        'user_id' => $user->id
    ]);
    
    // Clear any remaining OAuth session data
    $request->session()->forget([
        'pkce_code_verifier',
        'pkce_code_challenge',
        'pkce_state',
        'passport_state',
        'auth_user_id',
        'oauth_flow',
        'intended_url'
    ]);
    
    // Redirect to the frontend with the token exchange parameters
    return redirect($frontendUrl);
})->name('app.callback');

// Login route - redirect to Google OAuth
Route::get('/login', function() {
    return redirect()->route('auth.google.redirect');
})->name('login');

// Catch-all route for SPA (must be the last route)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
