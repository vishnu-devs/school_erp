<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::with('user')->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'school_id' => 'required|exists:schools,id',
            'employee_id' => 'required|string|unique:teachers,employee_id',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'school_id' => $request->school_id,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'dob' => $request->dob,
                'address' => $request->address,
            ]);

            $user->assignRole('Teacher');

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'employee_id' => $request->employee_id,
                'qualification' => $request->qualification,
                'experience' => $request->experience,
                'salary' => $request->salary,
                'joining_date' => $request->joining_date,
            ]);

            return response()->json([
                'message' => 'Teacher created successfully',
                'data' => $teacher->load('user')
            ], 201);
        });
    }

    public function show(Teacher $teacher)
    {
        return $teacher->load('user');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $teacher->user_id,
        ]);

        DB::transaction(function () use ($request, $teacher) {
            $teacher->user->update($request->only([
                'name', 'email', 'phone', 'gender', 'dob', 'address', 'status'
            ]));

            $teacher->update($request->only([
                'employee_id', 'qualification', 'experience', 'salary', 'joining_date'
            ]));
        });

        return response()->json([
            'message' => 'Teacher updated successfully',
            'data' => $teacher->load('user')
        ]);
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->user->delete(); // Cascades to teacher table
        return response()->json(['message' => 'Teacher deleted successfully']);
    }
}
