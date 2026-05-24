<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HoneypotMiddleware
{
    /**
     * Handle an incoming request.
     * Blocks automated bots that fill in hidden form fields.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the honeypot field (e.g., 'my_name') is filled out.
        // Humans shouldn't see it, bots will fill it.
        if ($request->has('my_name') && !empty($request->input('my_name'))) {
            // Silently discard the request, returning a generic 200 OK to trick the bot
            return response()->json(['message' => 'Request successful.'], 200);
        }

        return $next($request);
    }
}
