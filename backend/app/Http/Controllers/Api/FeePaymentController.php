<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = FeePayment::with(['student.user', 'feeCategory']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('payment_date', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id'      => 'required|exists:students,id',
            'fee_category_id' => 'required|exists:fee_categories,id',
            'amount'          => 'required|numeric|min:0',
            'payment_method'  => 'required|string|max:50',
            'payment_date'    => 'required|date',
            'status'          => 'required|in:Paid,Pending,Failed',
        ]);

        $data = $request->all();
        $data['transaction_id'] = 'TXN-' . strtoupper(Str::random(12));
        $data['receipt_no'] = 'RCP-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        $payment = FeePayment::create($data);
        return response()->json($payment->load(['student.user', 'feeCategory']), 201);
    }

    public function receipt(FeePayment $feePayment)
    {
        $feePayment->load(['student.user', 'feeCategory']);

        return response()->json([
            'receipt_no'     => $feePayment->receipt_no,
            'transaction_id' => $feePayment->transaction_id,
            'student_name'   => $feePayment->student->user->name ?? 'N/A',
            'roll_number'    => $feePayment->student->roll_number ?? 'N/A',
            'fee_category'   => $feePayment->feeCategory->category_name ?? 'N/A',
            'amount'         => $feePayment->amount,
            'payment_method' => $feePayment->payment_method,
            'payment_date'   => $feePayment->payment_date,
            'status'         => $feePayment->status,
            'generated_at'   => now()->toDateTimeString(),
        ]);
    }
}
