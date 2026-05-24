<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function attendanceReport(Request $request)
    {
        $request->validate([
            'class_id'   => 'required|exists:classes,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $records = Attendance::with('student.user')
            ->where('class_id', $request->class_id)
            ->whereBetween('attendance_date', [$request->start_date, $request->end_date])
            ->get();

        $summary = $records->groupBy('student_id')->map(function ($items, $studentId) {
            $student = $items->first()->student;
            return [
                'student_id'   => $studentId,
                'student_name' => $student->user->name ?? 'N/A',
                'total_days'   => $items->count(),
                'present'      => $items->where('status', 'Present')->count(),
                'absent'       => $items->where('status', 'Absent')->count(),
                'leave'        => $items->where('status', 'Leave')->count(),
                'percentage'   => $items->count() > 0
                    ? round(($items->where('status', 'Present')->count() / $items->count()) * 100, 1)
                    : 0,
            ];
        })->values();

        return response()->json([
            'report_type' => 'attendance',
            'filters'     => $request->only(['class_id', 'start_date', 'end_date']),
            'data'        => $summary,
        ]);
    }

    public function feeCollectionReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $payments = FeePayment::with(['student.user', 'feeCategory'])
            ->whereBetween('payment_date', [$request->start_date, $request->end_date])
            ->get();

        $summary = [
            'total_collected'  => $payments->where('status', 'Paid')->sum('amount'),
            'total_pending'    => $payments->where('status', 'Pending')->sum('amount'),
            'total_failed'     => $payments->where('status', 'Failed')->sum('amount'),
            'transaction_count'=> $payments->count(),
            'by_method'        => $payments->where('status', 'Paid')->groupBy('payment_method')->map(function ($items) {
                return ['count' => $items->count(), 'total' => $items->sum('amount')];
            }),
            'by_category'      => $payments->where('status', 'Paid')->groupBy(function ($item) {
                return $item->feeCategory->category_name ?? 'Unknown';
            })->map(function ($items) {
                return ['count' => $items->count(), 'total' => $items->sum('amount')];
            }),
        ];

        return response()->json([
            'report_type' => 'fee_collection',
            'filters'     => $request->only(['start_date', 'end_date']),
            'summary'     => $summary,
            'payments'    => $payments,
        ]);
    }

    public function examReport(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
        ]);

        $results = ExamResult::with(['student.user', 'subject'])
            ->where('exam_id', $request->exam_id)
            ->get();

        $byStudent = $results->groupBy('student_id')->map(function ($items, $studentId) {
            $student = $items->first()->student;
            return [
                'student_id'   => $studentId,
                'student_name' => $student->user->name ?? 'N/A',
                'roll_number'  => $student->roll_number,
                'subjects'     => $items->map(function ($r) {
                    return [
                        'subject' => $r->subject->subject_name,
                        'marks'   => $r->marks,
                        'grade'   => $r->grade,
                    ];
                }),
                'total_marks'  => $items->sum('marks'),
                'average'      => round($items->avg('marks'), 1),
            ];
        })->values();

        return response()->json([
            'report_type' => 'exam',
            'exam_id'     => $request->exam_id,
            'data'        => $byStudent,
            'class_average'=> $results->count() > 0 ? round($results->avg('marks'), 1) : 0,
        ]);
    }

    public function studentPerformanceReport(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        $student = Student::with('user')->findOrFail($request->student_id);

        $attendance = Attendance::where('student_id', $request->student_id)->get();
        $examResults = ExamResult::with(['exam', 'subject'])
            ->where('student_id', $request->student_id)
            ->get();

        return response()->json([
            'report_type'  => 'student_performance',
            'student'      => $student,
            'attendance'   => [
                'total_days' => $attendance->count(),
                'present'    => $attendance->where('status', 'Present')->count(),
                'absent'     => $attendance->where('status', 'Absent')->count(),
                'percentage' => $attendance->count() > 0
                    ? round(($attendance->where('status', 'Present')->count() / $attendance->count()) * 100, 1)
                    : 0,
            ],
            'exam_results' => $examResults->groupBy('exam_id')->map(function ($items) {
                return [
                    'exam_name'   => $items->first()->exam->exam_name,
                    'total_marks' => $items->sum('marks'),
                    'average'     => round($items->avg('marks'), 1),
                    'subjects'    => $items->map(function ($r) {
                        return [
                            'subject' => $r->subject->subject_name,
                            'marks'   => $r->marks,
                            'grade'   => $r->grade,
                        ];
                    }),
                ];
            })->values(),
        ]);
    }

    public function teacherReport(Request $request)
    {
        $teachers = Teacher::with(['user', 'subjects.class_'])->get();

        $data = $teachers->map(function ($teacher) {
            return [
                'teacher_id'     => $teacher->id,
                'name'           => $teacher->user->name ?? 'N/A',
                'employee_id'    => $teacher->employee_id,
                'qualification'  => $teacher->qualification,
                'subjects_count' => $teacher->subjects->count(),
                'subjects'       => $teacher->subjects->map(function ($s) {
                    return $s->subject_name . ' (' . ($s->class_->class_name ?? '') . ')';
                }),
            ];
        });

        return response()->json([
            'report_type'    => 'teacher',
            'total_teachers' => $teachers->count(),
            'data'           => $data,
        ]);
    }

    public function overviewReport(Request $request)
    {
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();

        $today = now()->toDateString();
        $todayAttendance = Attendance::where('attendance_date', $today)->get();

        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();
        $monthlyFees = FeePayment::whereBetween('payment_date', [$monthStart, $monthEnd])
            ->where('status', 'Paid')
            ->sum('amount');

        $pendingFees = FeePayment::where('status', 'Pending')->sum('amount');

        return response()->json([
            'total_students'        => $totalStudents,
            'total_teachers'        => $totalTeachers,
            'today_present'         => $todayAttendance->where('status', 'Present')->count(),
            'today_absent'          => $todayAttendance->where('status', 'Absent')->count(),
            'monthly_fee_collection'=> $monthlyFees,
            'pending_fees'          => $pendingFees,
        ]);
    }
}
