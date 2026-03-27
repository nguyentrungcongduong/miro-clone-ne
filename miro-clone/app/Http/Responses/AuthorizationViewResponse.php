<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Passport\Contracts\AuthorizationViewResponse as AuthorizationViewResponseContract;
use League\OAuth2\Server\RequestTypes\AuthorizationRequest;

class AuthorizationViewResponse implements AuthorizationViewResponseContract
{
    /**
     * The response parameters.
     *
     * @var array
     */
    protected $parameters = [];

    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request): \Symfony\Component\HttpFoundation\Response
    {
        /** @var AuthorizationRequest $authRequest */
        $authRequest = $request->session()->get('authRequest');
        $client = $authRequest->getClient();
        
        // Get the client details from the database
        $clientModel = \Laravel\Passport\Client::find($client->getIdentifier());
        
        return response()->view('vendor.passport.authorize', [
            'authToken' => $request->session()->get('authToken'),
            'client' => (object) [
                'id' => $client->getIdentifier(),
                'name' => $clientModel ? $clientModel->name : 'Unknown Client',
            ],
            'user' => $request->user(),
            'scopes' => $authRequest->getScopes(),
            'request' => [
                'client_id' => $client->getIdentifier(),
                'redirect_uri' => $authRequest->getRedirectUri(),
                'state' => $authRequest->getState(),
                'scopes' => $authRequest->getScopes(),
            ],
        ]);
    }

    /**
     * Add the necessary parameters to the response.
     *
     * @param  array  $parameters
     * @return static
     */
    public function withParameters(array $parameters = []): static
    {
        $this->parameters = $parameters;
        return $this;
    }
}
