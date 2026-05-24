<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $query = Timetable::with(['class_', 'subject', 'teacher.user']);

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->has('day')) {
            $query->where('day', $request->day);
        }

        return response()->json($query->orderBy('day')->orderBy('start_time')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'    => 'required|exists:classes,id',
            'subject_id'  => 'required|exists:subjects,id',
            'teacher_id'  => 'required|exists:teachers,id',
            'day'         => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
            'room_number' => 'required|string|max:50',
        ]);

        $timetable = Timetable::create($request->all());
        return response()->json($timetable->load(['class_', 'subject', 'teacher.user']), 201);
    }

    public function show(Timetable $timetable)
    {
        return response()->json($timetable->load(['class_', 'subject', 'teacher.user']));
    }

    public function update(Request $request, Timetable $timetable)
    {
        $request->validate([
            'class_id'    => 'sometimes|exists:classes,id',
            'subject_id'  => 'sometimes|exists:subjects,id',
            'teacher_id'  => 'sometimes|exists:teachers,id',
            'day'         => 'sometimes|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'  => 'sometimes|date_format:H:i',
            'end_time'    => 'sometimes|date_format:H:i',
            'room_number' => 'sometimes|string|max:50',
        ]);

        $timetable->update($request->all());
        return response()->json($timetable->load(['class_', 'subject', 'teacher.user']));
    }

    public function destroy(Timetable $timetable)
    {
        $timetable->delete();
        return response()->json(['message' => 'Timetable entry deleted']);
    }
}
