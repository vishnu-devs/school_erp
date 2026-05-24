<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getSchoolSettings(Request $request)
    {
        $school = School::find($request->user()->school_id);

        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        return response()->json($school);
    }

    public function updateSchoolSettings(Request $request)
    {
        $request->validate([
            'school_name' => 'sometimes|string|max:255',
            'email'       => 'sometimes|email|max:255',
            'phone'       => 'sometimes|string|max:20',
            'address'     => 'sometimes|string',
            'city'        => 'sometimes|string|max:100',
            'state'       => 'sometimes|string|max:100',
            'country'     => 'sometimes|string|max:100',
            'pincode'     => 'sometimes|string|max:20',
            'timezone'    => 'sometimes|string|max:50',
            'logo'        => 'nullable|file|max:2048|mimes:jpg,png,svg',
        ]);

        $school = School::findOrFail($request->user()->school_id);
        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $school->update($data);
        return response()->json(['message' => 'Settings updated', 'school' => $school]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'          => 'sometimes|string|max:255',
            'phone'         => 'sometimes|string|max:20',
            'address'       => 'sometimes|string',
            'profile_image' => 'nullable|file|max:2048|mimes:jpg,png',
        ]);

        $user = $request->user();
        $data = $request->except('profile_image');

        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }

        $user->update($data);
        return response()->json(['message' => 'Profile updated', 'user' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!\Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => \Hash::make($request->password)]);
        return response()->json(['message' => 'Password changed successfully']);
    }
}
