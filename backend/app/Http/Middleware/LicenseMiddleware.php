<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class LicenseMiddleware
{
    /**
     * Authorized domains that are legally licensed to run this proprietary SaaS.
     */
    protected $authorizedDomains = [
        'localhost',
        '127.0.0.1',
        'schoolites.com',
        'api.schoolites.com',
        'app.schoolites.com',
    ];

    /**
     * Handle an incoming request.
     * Prevents unauthorized white-label reselling or source code piracy.
     */
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();

        // Enforce Domain Binding
        if (!in_array($host, $this->authorizedDomains)) {
            return response()->json([
                'error' => 'ILLEGAL USAGE DETECTED',
                'message' => 'This software instance is unlicensed or pirated. Unauthorized redistribution is strictly prohibited under international copyright laws.',
                'contact' => 'legal@schoolites.com'
            ], 451); // 451 Unavailable For Legal Reasons
        }

        return $next($request);
    }
}
