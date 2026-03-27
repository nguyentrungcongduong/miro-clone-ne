<!DOCTYPE html>
<html>
<head>
    <title>Authorize Request</title>
    <style>
        body {
            font-family: 'Nunito', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
        }
        .card {
            text-align: center;
        }
        .card-header {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #333;
        }
        .scopes {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            text-align: left;
        }
        .scope {
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 1.5rem;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-approve {
            background-color: #4CAF50;
            color: white;
        }
        .btn-deny {
            background-color: #f44336;
            color: white;
        }
        .btn-approve:hover {
            background-color: #45a049;
        }
        .btn-deny:hover {
            background-color: #d32f2f;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Authorization Request
            </div>

            <div class="card-body">
                <p><strong>{{ $client->name ?? 'Application' }}</strong> is requesting permission to access your account.</p>
                
                @if (count($scopes) > 0)
                    <div class="scopes">
                        <p><strong>This application will be able to:</strong></p>
                        @foreach ($scopes as $scope)
                            <div class="scope">
                                {{ $scope->id }}
                            </div>
                        @endforeach
                    </div>
                @endif

                <div class="buttons">
                    <form method="post" action="{{ route('passport.authorizations.approve') }}">
                        @csrf
                        <input type="hidden" name="state" value="{{ $request['state'] }}">
                        <input type="hidden" name="client_id" value="{{ $client->id }}">
                        <input type="hidden" name="auth_token" value="{{ $authToken }}">
                        <button type="submit" class="btn btn-approve">
                            Authorize
                        </button>
                    </form>

                    <form method="post" action="{{ route('passport.authorizations.deny') }}">
                        @csrf
                        @method('DELETE')
                        <input type="hidden" name="state" value="{{ $request['state'] }}">
                        <input type="hidden" name="client_id" value="{{ $client->id }}">
                        <input type="hidden" name="auth_token" value="{{ $authToken }}">
                        <button class="btn btn-deny">
                            Deny
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
