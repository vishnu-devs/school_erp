<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantOnboardingController extends Controller
{
    /**
     * Public endpoint for new schools to sign up for the SaaS platform.
     */
    public function register(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'domain'      => 'required|string|unique:domains,domain',
            'admin_name'  => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|string|min:8',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create the School (Tenant)
            $school = School::create([
                'school_name' => $request->school_name,
                'email'       => $request->email, // The school contact email can default to the admin's email initially
                'status'      => 1, // Auto-activate
            ]);

            // Create Domain Mapping for stancl/tenancy
            $school->domains()->create([
                'domain' => strtolower($request->domain)
            ]);

            // 2. Create the School Admin User
            $user = User::create([
                'name'      => $request->admin_name,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'school_id' => $school->id,
            ]);

            // Set Spatie Team ID and assign the correct seeded role
            setPermissionsTeamId($school->id);
            $user->assignRole('School Admin');

            DB::commit();

            // Auto-login the new user
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'School registered successfully!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->load('school'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }
}
