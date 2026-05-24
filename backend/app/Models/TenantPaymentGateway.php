<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantPaymentGateway extends Model
{
    protected $fillable = ['school_id', 'payment_gateway_id', 'credentials', 'qr_code_path', 'instructions', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'credentials' => 'array',
    ];
}
