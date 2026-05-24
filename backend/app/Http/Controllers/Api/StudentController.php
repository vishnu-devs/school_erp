<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with(['user', 'studentClass'])->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'school_id' => 'required|exists:schools,id',
            'class_id' => 'required|exists:classes,id',
            'admission_no' => 'required|string|unique:students,admission_no',
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

            $user->assignRole('Student');

            $student = Student::create([
                'user_id' => $user->id,
                'admission_no' => $request->admission_no,
                'class_id' => $request->class_id,
                'roll_number' => $request->roll_number,
                'father_name' => $request->father_name,
                'mother_name' => $request->mother_name,
                'parent_phone' => $request->parent_phone,
                'blood_group' => $request->blood_group,
                'religion' => $request->religion,
                'category' => $request->category,
                'admission_date' => $request->admission_date,
            ]);

            return response()->json([
                'message' => 'Student created successfully',
                'data' => $student->load('user')
            ], 201);
        });
    }

    public function show(Student $student)
    {
        return $student->load(['user', 'studentClass']);
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $student->user_id,
            'class_id' => 'sometimes|exists:classes,id',
        ]);

        DB::transaction(function () use ($request, $student) {
            $student->user->update($request->only([
                'name', 'email', 'phone', 'gender', 'dob', 'address', 'status'
            ]));

            $student->update($request->only([
                'class_id', 'roll_number', 'father_name', 'mother_name', 'parent_phone',
                'blood_group', 'religion', 'category', 'admission_date'
            ]));
        });

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $student->load('user')
        ]);
    }

    public function destroy(Student $student)
    {
        $student->user->delete(); // Cascades to student table
        return response()->json(['message' => 'Student deleted successfully']);
    }
}
