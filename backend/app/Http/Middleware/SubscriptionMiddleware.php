<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Manually check via sanctum guard as this runs before route middleware in Laravel 11's prepend api stack
        if (auth('sanctum')->check()) {
            $user = auth('sanctum')->user();

            // Platform Super Admin is completely exempt
            if (is_null($user->school_id)) {
                return $next($request);
            }

            // Exclude logout, profile checking, and SaaS billing/checkout endpoints
            $exemptRoutes = [
                'api/logout',
                'api/me',
                'api/subscription/payment-gateways',
                'api/subscription/checkout',
                'api/subscription/status',
            ];

            foreach ($exemptRoutes as $route) {
                if ($request->is($route) || $request->is($route . '/*')) {
                    return $next($request);
                }
            }

            $school = $user->school;
            if ($school) {
                // Initialize tenancy so that BelongsToTenant and custom tenant scopes are automatically applied to all models!
                tenancy()->initialize($school);

                $expiry = $school->subscription_expiry;

                // Lockout if subscription has expired or has not been set (unpaid onboarding)
                if (is_null($expiry) || \Carbon\Carbon::parse($expiry)->isPast()) {
                    return response()->json([
                        'error' => 'Payment Required: Your school subscription is inactive or has expired.',
                        'requires_payment' => true,
                        'school_name' => $school->school_name,
                        'expiry_date' => $expiry,
                    ], 402);
                }
            }
        }

        return $next($request);
    }
}
