<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportRoute extends Model
{
    protected $fillable = [
        'school_id', 'route_name', 'vehicle_number',
        'driver_name', 'driver_phone', 'pickup_points', 'status',
    ];

    protected $casts = [
        'pickup_points' => 'array',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'transport_route_id');
    }
}
