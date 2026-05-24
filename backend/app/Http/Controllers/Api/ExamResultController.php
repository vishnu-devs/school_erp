<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use Illuminate\Http\Request;

class ExamResultController extends Controller
{
    public function index(Request $request)
    {
        $query = ExamResult::with(['exam', 'student.user', 'subject']);

        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        return response()->json($query->paginate(50));
    }

    public function store(Request $request)
    {
        $request->validate([
            'results'              => 'required|array|min:1',
            'results.*.exam_id'    => 'required|exists:exams,id',
            'results.*.student_id' => 'required|exists:students,id',
            'results.*.subject_id' => 'required|exists:subjects,id',
            'results.*.marks'      => 'required|numeric|min:0',
            'results.*.grade'      => 'required|string|max:10',
            'results.*.remarks'    => 'nullable|string',
        ]);

        $created = [];
        foreach ($request->results as $result) {
            $created[] = ExamResult::updateOrCreate(
                [
                    'exam_id'    => $result['exam_id'],
                    'student_id' => $result['student_id'],
                    'subject_id' => $result['subject_id'],
                ],
                [
                    'marks'   => $result['marks'],
                    'grade'   => $result['grade'],
                    'remarks' => $result['remarks'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Results saved', 'count' => count($created)], 201);
    }

    public function show(ExamResult $examResult)
    {
        return response()->json($examResult->load(['exam', 'student.user', 'subject']));
    }

    public function destroy(ExamResult $examResult)
    {
        $examResult->delete();
        return response()->json(['message' => 'Result deleted']);
    }
}
