<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        return School::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'email' => 'required|email|unique:schools,email',
        ]);

        $school = School::create($request->all());

        return response()->json([
            'message' => 'School created successfully',
            'data' => $school
        ], 201);
    }

    public function show(School $school)
    {
        return $school->load(['classes', 'users']);
    }

    public function update(Request $request, School $school)
    {
        $school->update($request->all());
        return response()->json(['message' => 'School updated successfully', 'data' => $school]);
    }

    public function destroy(School $school)
    {
        $school->delete();
        return response()->json(['message' => 'School deleted successfully']);
    }
}
