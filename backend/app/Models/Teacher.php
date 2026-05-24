<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class Teacher extends Model implements Auditable
{
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected static function booted()
    {
        static::addGlobalScope('tenant', function ($builder) {
            if (tenancy()->tenant) {
                $builder->whereHas('user', function ($q) {
                    $q->where('school_id', tenancy()->tenant->id);
                });
            }
        });
    }

    protected $fillable = [
        'user_id',
        'employee_id',
        'qualification',
        'experience',
        'salary',
        'joining_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function homework()
    {
        return $this->hasMany(Homework::class);
    }
}
