<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class Student extends Model implements Auditable
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
        'admission_no',
        'class_id',
        'roll_number',
        'father_name',
        'mother_name',
        'parent_phone',
        'blood_group',
        'religion',
        'category',
        'transport_route_id',
        'admission_date',
    ];

    protected $casts = [
        'admission_date' => 'date',
        'parent_phone' => 'encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function studentClass()
    {
        return $this->belongsTo(StudentClass::class, 'class_id');
    }

    public function transportRoute()
    {
        return $this->belongsTo(TransportRoute::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    public function examResults()
    {
        return $this->hasMany(ExamResult::class);
    }
}
