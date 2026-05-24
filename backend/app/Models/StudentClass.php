<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class StudentClass extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'classes';

    protected $fillable = [
        'school_id',
        'class_name',
        'section',
        'class_teacher_id',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}
