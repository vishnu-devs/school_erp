<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';
    protected $fillable = ['student_id', 'class_id', 'attendance_date', 'status', 'remarks', 'created_by'];

    protected $casts = [
        'attendance_date' => 'date',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function studentClass() { return $this->belongsTo(StudentClass::class, 'class_id'); }
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }
}
