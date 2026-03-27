<?php

use Illuminate\Support\Facades\Route;
use Laravel\Passport\Contracts\AuthorizationViewResponse;

Route::get('/debug/interface', function () {
    $reflection = new ReflectionClass(AuthorizationViewResponse::class);
    $methods = $reflection->getMethods();
    
    $result = [];
    foreach ($methods as $method) {
        $result[] = [
            'name' => $method->getName(),
            'returnType' => $method->getReturnType() ? $method->getReturnType()->getName() : 'mixed',
            'parameters' => array_map(function($param) {
                return [
                    'name' => $param->getName(),
                    'type' => $param->getType() ? $param->getType()->getName() : 'mixed',
                    'default' => $param->isDefaultValueAvailable() ? $param->getDefaultValue() : null,
                ];
            }, $method->getParameters()),
        ];
    }
    
    return response()->json($result);
});
