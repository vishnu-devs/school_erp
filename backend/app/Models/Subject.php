<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'class_id', 'subject_name', 'subject_code', 'teacher_id',
    ];

    public function class_()
    {
        return $this->belongsTo(StudentClass::class, 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function homework()
    {
        return $this->hasMany(Homework::class);
    }

    public function timetableEntries()
    {
        return $this->hasMany(Timetable::class);
    }
}
