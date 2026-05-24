<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TenantProfile;
use Illuminate\Http\Request;

class TenantProfileController extends Controller
{
    /**
     * Fetch the public white-label profile for the current tenant.
     * This route does NOT require authentication because the frontend needs 
     * the branding (logo, colors, login bg) to render the login page dynamically!
     */
    public function getPublicProfile(Request $request)
    {
        // stancl/tenancy automatically scopes this via the InitializeTenancyByDomain middleware
        $tenant = tenant(); 

        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found.'], 404);
        }

        // We fetch the profile related to this school_id
        $profile = TenantProfile::where('school_id', $tenant->id)->first();

        return response()->json([
            'school_name' => $tenant->school_name,
            'branding' => [
                'short_name' => $profile->short_name ?? null,
                'slogan' => $profile->slogan ?? null,
                'primary_color' => $profile->primary_color ?? '#4f46e5',
                'secondary_color' => $profile->secondary_color ?? '#1e293b',
                'favicon' => $profile->favicon ? asset('storage/' . $profile->favicon) : null,
                'login_background' => $profile->login_background ? asset('storage/' . $profile->login_background) : null,
                'logo' => $tenant->logo ? asset('storage/' . $tenant->logo) : null,
            ],
            'leadership' => [
                'director' => $profile && $profile->show_director ? [
                    'name' => $profile->director_name,
                    'photo' => $profile->director_photo ? asset('storage/' . $profile->director_photo) : null,
                    'message' => $profile->director_message,
                ] : null,
                'principal' => $profile && $profile->show_principal ? [
                    'name' => $profile->principal_name,
                    'photo' => $profile->principal_photo ? asset('storage/' . $profile->principal_photo) : null,
                    'message' => $profile->principal_message,
                ] : null,
            ],
            'contact' => [
                'email' => $profile->support_email ?? $tenant->email,
                'website' => $profile->website_url ?? null,
                'social_links' => $profile->social_links ?? null,
            ]
        ]);
    }
}
