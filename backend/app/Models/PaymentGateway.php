<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = ['name', 'slug', 'type', 'is_active', 'icon', 'credentials', 'instructions'];

    protected $casts = [
        'is_active' => 'boolean',
        'credentials' => 'array',
    ];
}
