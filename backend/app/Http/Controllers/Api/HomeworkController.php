<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Homework;
use Illuminate\Http\Request;

class HomeworkController extends Controller
{
    public function index(Request $request)
    {
        $query = Homework::with(['class_', 'subject', 'teacher.user']);

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        return response()->json($query->orderBy('due_date', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'    => 'required|exists:classes,id',
            'subject_id'  => 'required|exists:subjects,id',
            'teacher_id'  => 'required|exists:teachers,id',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'due_date'    => 'required|date',
            'attachment'  => 'nullable|file|max:5120|mimes:jpg,png,pdf,docx',
        ]);

        $data = $request->except('attachment');

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')->store('homework', 'public');
        }

        $homework = Homework::create($data);
        return response()->json($homework->load(['class_', 'subject', 'teacher.user']), 201);
    }

    public function show(Homework $homework)
    {
        return response()->json($homework->load(['class_', 'subject', 'teacher.user']));
    }

    public function update(Request $request, Homework $homework)
    {
        $request->validate([
            'class_id'    => 'sometimes|exists:classes,id',
            'subject_id'  => 'sometimes|exists:subjects,id',
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'due_date'    => 'sometimes|date',
            'attachment'  => 'nullable|file|max:5120|mimes:jpg,png,pdf,docx',
        ]);

        $data = $request->except('attachment');

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')->store('homework', 'public');
        }

        $homework->update($data);
        return response()->json($homework->load(['class_', 'subject', 'teacher.user']));
    }

    public function destroy(Homework $homework)
    {
        $homework->delete();
        return response()->json(['message' => 'Homework deleted successfully']);
    }
}
