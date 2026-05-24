<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Homework extends Model
{
    protected $table = 'homework';

    protected $fillable = [
        'class_id', 'subject_id', 'teacher_id',
        'title', 'description', 'attachment', 'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function class_()
    {
        return $this->belongsTo(StudentClass::class, 'class_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
