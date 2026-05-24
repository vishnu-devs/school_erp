<?php

namespace App\Services;

use Razorpay\Api\Api;
use App\Models\Plan;
use App\Models\School;
use App\Models\Subscription;
use App\Models\FinancialTransaction;
use App\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class RazorpayGateway implements PaymentGatewayInterface
{
    protected $api;

    public function __construct()
    {
        $keyId = env('RAZORPAY_KEY_ID');
        $keySecret = env('RAZORPAY_KEY_SECRET');
        if ($keyId && $keySecret) {
            $this->api = new Api($keyId, $keySecret);
        }
    }

    public function createOrder(float $amount, string $currency, array $metadata = []): array
    {
        try {
            $order = $this->api->order->create([
                'receipt'         => $metadata['receipt_id'] ?? uniqid(),
                'amount'          => $amount * 100, // paise
                'currency'        => $currency,
                'payment_capture' => 1 // auto capture
            ]);

            return [
                'order_id' => $order['id'],
                'amount' => $amount,
                'currency' => $currency
            ];
        } catch (\Exception $e) {
            Log::error('Razorpay Order Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifySignature(array $payload, string $signature): bool
    {
        try {
            $this->api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $payload['razorpay_order_id'],
                'razorpay_payment_id' => $payload['razorpay_payment_id'],
                'razorpay_signature'  => $signature
            ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Razorpay Signature Verification Failed: ' . $e->getMessage());
            return false;
        }
    }

    public function processRefund(FinancialTransaction $transaction, ?float $amount = null): bool
    {
        try {
            $refundData = [];
            if ($amount) {
                $refundData['amount'] = $amount * 100;
            }
            
            // Requires the transaction reference to be the razorpay_payment_id
            $this->api->payment->fetch($transaction->transaction_reference)->refund($refundData);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Razorpay Refund Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create a Razorpay Plan matching our local Plan
     */
    public function createPlan(Plan $plan)
    {
        try {
            $razorpayPlan = $this->api->plan->create([
                'period' => 'monthly',
                'interval' => $plan->billing_cycle === 'yearly' ? 12 : 1,
                'item' => [
                    'name' => 'SaaS Subscription: ' . $plan->name,
                    'description' => 'Billing for ' . $plan->name,
                    'amount' => $plan->price * 100, // in paise
                    'currency' => 'INR'
                ],
                'notes' => [
                    'plan_id' => $plan->id
                ]
            ]);

            $plan->update(['razorpay_plan_id' => $razorpayPlan->id]);
            return $razorpayPlan;
        } catch (\Exception $e) {
            Log::error('Razorpay Plan Creation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create a subscription for a school.
     */
    public function createSubscription(School $school, Plan $plan)
    {
        if (!$plan->razorpay_plan_id) {
            $this->createPlan($plan);
        }

        try {
            $subscription = $this->api->subscription->create([
                'plan_id' => $plan->razorpay_plan_id,
                'customer_notify' => 1,
                'total_count' => 120, // max billing cycles
            ]);

            return Subscription::create([
                'school_id' => $school->id,
                'plan_id' => $plan->id,
                'razorpay_subscription_id' => $subscription->id,
                'status' => 'created',
                'ends_at' => now()->addDays(14) // Assuming 14 days initial trial/grace before first payment
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay Subscription Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
