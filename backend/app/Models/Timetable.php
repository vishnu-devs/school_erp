<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $table = 'timetable';
    protected $fillable = ['class_id', 'subject_id', 'teacher_id', 'day', 'start_time', 'end_time', 'room_number'];

    public function studentClass() { return $this->belongsTo(StudentClass::class, 'class_id'); }
    
    // Alias used by TimetableController eager loading
    public function class_() { return $this->belongsTo(StudentClass::class, 'class_id'); }
    
    public function subject() { return $this->belongsTo(Subject::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
}
