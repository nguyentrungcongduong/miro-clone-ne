<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
// use DB;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;



class AuthController extends Controller
{
    /**
     * Generate a random string of bytes and return as base64url.
     *
     * @param int $length
     * @return string
     */
    protected function generatePkceCodeVerifier($length = 64)
    {
        return rtrim(strtr(base64_encode(random_bytes($length)), '+/', '-_'), '=');
    }

    /**
     * Generate a code challenge from a code verifier for use with PKCE.
     *
     * @param string $codeVerifier
     * @return string
     */
    protected function generatePkceCodeChallenge($codeVerifier)
    {
        $hashed = hash('sha256', $codeVerifier, true);
        return rtrim(strtr(base64_encode($hashed), '+/', '-_'), '=');
    }




    public function getUserData(Request $request)
       {

           $loginUser = DB::table('oauth_access_tokens')
               ->where('client_id', $request->client_id)
               ->where('user_id', $request->user_id)
               ->first();

           if (! is_null($loginUser)) {

               $userId = $loginUser->user_id;

               $user = User::where('id', $userId)
                   ->select('id', 'name', 'email')
                   ->first();

               return response(['user' => $user]);



           }

       }


    public function redirectToGoogle(Request $request)
    {
        // If we're already processing an OAuth flow, don't start a new one
        if ($request->session()->has('pkce_state')) {
            $request->session()->reflash();
            return redirect('/');
        }

        try {
            // Clear any previous OAuth data
            $request->session()->forget([
                'pkce_code_verifier',
                'pkce_code_challenge',
                'pkce_state',
                'passport_state',
                'auth_user_id',
                'oauth_flow',
                'intended_url'
            ]);

            // Generate PKCE code verifier and challenge
            $codeVerifier = $this->generatePkceCodeVerifier();
            $codeChallenge = $this->generatePkceCodeChallenge($codeVerifier);
            $state = Str::random(40);
            
            // Store code verifier in session
            $request->session()->put([
                'pkce_code_verifier' => $codeVerifier,
                'pkce_code_challenge' => $codeChallenge,
                'pkce_state' => $state,
                'oauth_flow' => 'google',
                'intended_url' => $request->input('intended', '/'),
            ]);
            
            // Build the Google OAuth URL with PKCE parameters
            $query = http_build_query([
                'client_id' => config('services.google.client_id'),
                'redirect_uri' => route('auth.google.callback'),
                'response_type' => 'code',
                'scope' => 'openid profile email',
                'state' => $state,
                'code_challenge' => $codeChallenge,
                'code_challenge_method' => 'S256',
                'access_type' => 'offline',
                'prompt' => 'consent', // Only ask for consent once
            ]);
            
            $googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . $query;
            
            \Log::debug('Redirecting to Google OAuth URL', [
                'url' => $googleAuthUrl,
                'state' => $state,
                'session_keys' => array_keys($request->session()->all())
            ]);
            
            // Use a 302 redirect to prevent caching
            return redirect()->away($googleAuthUrl, 302, [
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
                
        } catch (\Exception $e) {
            // Clear any existing OAuth session data
            $request->session()->forget([
                'pkce_code_verifier',
                'pkce_code_challenge',
                'pkce_state',
                'passport_state',
                'auth_user_id',
                'oauth_flow',
                'intended_url'
            ]);
            
            \Log::error('Google OAuth Redirect Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'session' => $request->session()->all(),
                'request' => $request->all(),
                'session_id' => session()->getId()
            ]);
            
            return redirect('/login')
                ->with('error', 'Failed to initialize Google OAuth: ' . $e->getMessage());
        }
    }


    public function createUserViaGoogle(Request $request)
    {
        try {
            // If we already have a code, process the callback
            if ($request->has('code')) {
                // Verify state to prevent CSRF
                $state = $request->session()->pull('pkce_state');
                if (!$state || $state !== $request->state) {
                    throw new \RuntimeException('Invalid state parameter');
                }
                
                // Get the Google user
                $googleUser = Socialite::driver('google')->user();
                
                // Find or create the user
                $user = User::where('email', $googleUser->email)->first();
                
                if (!$user) {
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'password' => bcrypt(Str::random(24)),
                        'email_verified_at' => now(),
                    ]);
                }
                
                // Log the user in
                Auth::login($user);
                
                // Generate PKCE code verifier and challenge
                $codeVerifier = $this->generatePkceCodeVerifier();
                $codeChallenge = $this->generatePkceCodeChallenge($codeVerifier);
                
                // Generate a state parameter for the Passport flow
                $passportState = Str::random(40);
                
                // Store in session for the token request
                $request->session()->put([
                    'pkce_code_verifier' => $codeVerifier,
                    'passport_state' => $passportState,
                    'auth_user_id' => $user->id,
                ]);
                
                // Build the authorization URL for Passport
                $query = http_build_query([
                    'client_id' => '01979f1d-c8b3-7291-a186-72fbed328c91',
                    'redirect_uri' => 'http://127.0.0.1:8000/app/callback',
                    'response_type' => 'code',
                    'scope' => '',
                    'state' => $passportState,
                    'code_challenge' => $codeChallenge,
                    'code_challenge_method' => 'S256',
                    'prompt' => 'none',  // Changed from 'consent' to 'none' to prevent re-prompting
                ]);
                
                $authorizationUrl = 'http://127.0.0.1:8000/oauth/authorize?' . $query;
                
                \Log::debug('Redirecting to Passport authorization URL', [
                    'url' => $authorizationUrl,
                    'has_code_verifier' => !empty($codeVerifier),
                    'code_challenge' => $codeChallenge,
                    'state' => $passportState,
                    'session_keys' => array_keys($request->session()->all())
                ]);
                
                // Use a 302 redirect to prevent caching
                return redirect()->away($authorizationUrl, 302, [
                    'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ]);
            }
            
            // If we don't have a code yet, redirect to Google
            return redirect()->route('auth.google.redirect');
                
        } catch (\Exception $e) {
            // Clear any existing OAuth session data
            $request->session()->forget([
                'pkce_code_verifier',
                'pkce_code_challenge',
                'pkce_state',
                'passport_state',
                'auth_user_id',
                'oauth_flow',
                'intended_url'
            ]);
            
            \Log::error('Google OAuth Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'session' => $request->session()->all(),
                'request' => $request->all(),
                'session_id' => session()->getId()
            ]);
            
            return redirect('/login')
                ->with('error', 'Authentication failed: ' . $e->getMessage());
        }
    }






    public function logout(Request $request)
    {

        DB::table('oauth_access_tokens')
            ->where('user_id', $request->userId)
            ->delete();

        return response(['message' => 'user logged out']);
    }



}
