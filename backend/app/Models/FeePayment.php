<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    protected $fillable = [
        'student_id', 'fee_category_id', 'amount', 'payment_method', 
        'transaction_id', 'payment_date', 'receipt_no', 'status'
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function feeCategory() { return $this->belongsTo(FeeCategory::class); }
}
