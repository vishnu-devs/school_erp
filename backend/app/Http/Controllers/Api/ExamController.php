<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::with('class_');

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        return response()->json($query->orderBy('start_date', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'exam_name'  => 'required|string|max:255',
            'class_id'   => 'required|exists:classes,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $exam = Exam::create($request->all());
        return response()->json($exam->load('class_'), 201);
    }

    public function show(Exam $exam)
    {
        return response()->json($exam->load(['class_', 'results.student.user', 'results.subject']));
    }

    public function update(Request $request, Exam $exam)
    {
        $request->validate([
            'exam_name'  => 'sometimes|string|max:255',
            'class_id'   => 'sometimes|exists:classes,id',
            'start_date' => 'sometimes|date',
            'end_date'   => 'sometimes|date|after_or_equal:start_date',
        ]);

        $exam->update($request->all());
        return response()->json($exam->load('class_'));
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();
        return response()->json(['message' => 'Exam deleted successfully']);
    }
}
