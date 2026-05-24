<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index()
    {
        return StudentClass::with('school')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'class_name' => 'required|string|max:100',
            'section' => 'nullable|string|max:10',
        ]);

        $class = StudentClass::create($request->all());

        return response()->json([
            'message' => 'Class created successfully',
            'data' => $class
        ], 201);
    }

    public function show(StudentClass $class)
    {
        return $class->load(['school', 'students.user']);
    }

    public function update(Request $request, StudentClass $class)
    {
        $class->update($request->all());
        return response()->json(['message' => 'Class updated successfully', 'data' => $class]);
    }

    public function destroy(StudentClass $class)
    {
        $class->delete();
        return response()->json(['message' => 'Class deleted successfully']);
    }
}
