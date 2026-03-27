<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use Laravel\Passport\Contracts\AuthorizationViewResponse as AuthorizationViewResponseContract;
use App\Http\Responses\AuthorizationViewResponse as CustomAuthorizationViewResponse;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthorizationViewResponseContract::class, function () {
            return new CustomAuthorizationViewResponse();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

//        Passport::hashClientSecrets();
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

    }
}
