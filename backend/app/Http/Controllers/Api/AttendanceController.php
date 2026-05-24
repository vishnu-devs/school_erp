<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function mark(Request $request)
    {
        $request->validate([
            'records'                  => 'required|array|min:1',
            'records.*.student_id'     => 'required|exists:students,id',
            'records.*.class_id'       => 'required|exists:classes,id',
            'records.*.attendance_date'=> 'required|date',
            'records.*.status'         => 'required|in:Present,Absent,Leave',
            'records.*.remarks'        => 'nullable|string',
        ]);

        $marked = [];
        foreach ($request->records as $record) {
            $marked[] = Attendance::updateOrCreate(
                [
                    'student_id'      => $record['student_id'],
                    'attendance_date' => $record['attendance_date'],
                ],
                [
                    'class_id'   => $record['class_id'],
                    'status'     => $record['status'],
                    'remarks'    => $record['remarks'] ?? null,
                    'created_by' => $request->user()->id,
                ]
            );
        }

        return response()->json([
            'message' => 'Attendance marked successfully',
            'count'   => count($marked),
        ]);
    }

    public function getAttendance(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date'     => 'required|date',
        ]);

        $records = Attendance::with('student.user')
            ->where('class_id', $request->class_id)
            ->where('attendance_date', $request->date)
            ->get();

        return response()->json($records);
    }

    public function report(Request $request)
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

        $summary = $records->groupBy('student_id')->map(function ($items) {
            $student = $items->first()->student;
            return [
                'student_name' => $student->user->name ?? 'N/A',
                'roll_number'  => $student->roll_number,
                'total_days'   => $items->count(),
                'present'      => $items->where('status', 'Present')->count(),
                'absent'       => $items->where('status', 'Absent')->count(),
                'leave'        => $items->where('status', 'Leave')->count(),
                'percentage'   => $items->count() > 0
                    ? round(($items->where('status', 'Present')->count() / $items->count()) * 100, 1)
                    : 0,
            ];
        })->values();

        return response()->json($summary);
    }
}
