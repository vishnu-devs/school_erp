<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'api',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->prefix('api')->group(function () {
    
    // Public route to fetch White Label configuration (Colors, Logos, etc) before logging in
    Route::get('/tenant/profile', [\App\Http\Controllers\Api\TenantProfileController::class, 'getPublicProfile']);

    // Authenticated Tenant Routes
    Route::middleware('auth:sanctum')->group(function() {
        Route::get('/tenant/dashboard', function () {
            return response()->json([
                'message' => 'Welcome to ' . tenant('school_name') . ' Dashboard!'
            ]);
        });
    });
});
