<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans antialiased bg-gray-100">
    <div class="min-h-screen flex flex-col justify-center items-center p-6">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome to Miro Clone</h1>
                        <p class="text-gray-600">Sign in to start collaborating</p>
                    </div>
                    
                    <div class="mt-6">
                        <a href="{{ route('login') }}" 
                           class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.881-1.757-4.44-2.84-6.735-2.84-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10-7.524 10-11.006 0-1.041-0.11-1.735-0.2-2.495h-9.8z"></path>
                            </svg>
                            Sign in with Google
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Vue.js app will be mounted here -->
    <div id="app"></div>
    
    @vite(['resources/js/App.ts', 'resources/css/app.css'])
</body>

</html>
