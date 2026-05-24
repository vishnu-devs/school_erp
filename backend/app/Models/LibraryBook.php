<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LibraryBook extends Model
{
    protected $fillable = [
        'school_id', 'book_name', 'author', 'isbn',
        'category', 'quantity', 'available_quantity',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function issues()
    {
        return $this->hasMany(BookIssue::class, 'book_id');
    }
}
