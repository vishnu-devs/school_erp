<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'exam_name', 'class_id', 'start_date', 'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function class_()
    {
        return $this->belongsTo(StudentClass::class, 'class_id');
    }

    public function results()
    {
        return $this->hasMany(ExamResult::class);
    }
}
