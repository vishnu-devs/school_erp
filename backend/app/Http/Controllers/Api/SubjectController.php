<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::with(['class_', 'teacher.user']);

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        return response()->json($query->paginate(50));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'     => 'required|exists:classes,id',
            'subject_name' => 'required|string|max:255',
            'subject_code' => 'required|string|max:100',
            'teacher_id'   => 'required|exists:teachers,id',
        ]);

        $subject = Subject::create($request->all());
        return response()->json($subject->load(['class_', 'teacher.user']), 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject->load(['class_', 'teacher.user']));
    }

    public function update(Request $request, Subject $subject)
    {
        $request->validate([
            'class_id'     => 'sometimes|exists:classes,id',
            'subject_name' => 'sometimes|string|max:255',
            'subject_code' => 'sometimes|string|max:100',
            'teacher_id'   => 'sometimes|exists:teachers,id',
        ]);

        $subject->update($request->all());
        return response()->json($subject->load(['class_', 'teacher.user']));
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }
}
