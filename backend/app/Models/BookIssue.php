<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookIssue extends Model
{
    protected $fillable = [
        'book_id', 'student_id', 'issue_date',
        'return_date', 'actual_return_date', 'fine', 'status',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'return_date' => 'date',
        'actual_return_date' => 'date',
    ];

    public function book()
    {
        return $this->belongsTo(LibraryBook::class, 'book_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
