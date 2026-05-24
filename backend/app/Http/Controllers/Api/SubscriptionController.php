<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\PaymentGateway;
use App\Models\Subscription;
use App\Models\FinancialTransaction;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Get active SaaS plans for the public landing page and checkout.
     */
    public function getPublicPlans()
    {
        $plans = Plan::where('is_active', true)->get();
        return response()->json($plans);
    }

    /**
     * Get the global platform-level payment gateways (UPI, Bank, Card).
     * Accessible by School Admins even when locked out.
     */
    public function getSaaSPaymentGateways()
    {
        $gateways = PaymentGateway::where('is_active', true)->get();
        return response()->json($gateways);
    }

    /**
     * Get the subscription status and remaining days for the current school.
     */
    public function getStatus(Request $request)
    {
        $user = $request->user();
        if (is_null($user->school_id)) {
            return response()->json(['error' => 'Super Admins do not have a school subscription.'], 400);
        }

        $school = $user->school;
        $activeSubscription = Subscription::where('school_id', $school->id)
            ->where('status', 'active')
            ->with('plan')
            ->latest()
            ->first();

        $pendingTransaction = FinancialTransaction::where('school_id', $school->id)
            ->where('payable_type', Subscription::class)
            ->where('status', 'under_review')
            ->latest()
            ->first();

        $expiry = $school->subscription_expiry;
        $daysRemaining = 0;
        $isExpired = true;

        if ($expiry) {
            $expiryDate = Carbon::parse($expiry);
            $isExpired = $expiryDate->isPast();
            $daysRemaining = $isExpired ? 0 : now()->diffInDays($expiryDate, false) + 1;
        }

        return response()->json([
            'school_name' => $school->school_name,
            'plan_name' => $school->subscription_plan ?: 'None',
            'expiry_date' => $expiry,
            'days_remaining' => (int) $daysRemaining,
            'is_expired' => $isExpired,
            'active_subscription' => $activeSubscription,
            'pending_verification' => $pendingTransaction ? [
                'id' => $pendingTransaction->id,
                'amount' => $pendingTransaction->amount,
                'status' => $pendingTransaction->status,
                'reference' => $pendingTransaction->transaction_reference,
                'created_at' => $pendingTransaction->created_at->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Process checkout/payment for a subscription plan.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'payment_gateway_id' => 'required|exists:payment_gateways,id',
            'transaction_reference' => 'nullable|string|max:255',
            'proof_image' => 'nullable|image|max:4096',
        ]);

        $user = $request->user();
        if (is_null($user->school_id)) {
            return response()->json(['error' => 'Super Admins cannot subscribe to plans.'], 400);
        }

        $school = School::findOrFail($user->school_id);
        $plan = Plan::findOrFail($request->plan_id);
        $gateway = PaymentGateway::findOrFail($request->payment_gateway_id);

        // Check if there is already an active/future subscription to extend, otherwise start from now
        $baseDate = now();
        if ($school->subscription_expiry && Carbon::parse($school->subscription_expiry)->isFuture()) {
            $baseDate = Carbon::parse($school->subscription_expiry);
        }

        $startsAt = $baseDate;
        $endsAt = $startsAt->copy()->addDays($plan->duration_days);

        try {
            return DB::transaction(function () use ($school, $plan, $gateway, $startsAt, $endsAt, $request) {
                // 1. Create the subscription record (marked as pending/expired until payment is completed/verified)
                $status = ($gateway->slug === 'card') ? 'active' : 'pending';
                
                $subscription = Subscription::create([
                    'school_id' => $school->id,
                    'plan_id' => $plan->id,
                    'status' => $status,
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);

                // Handle Proof Screenshot Upload if provided
                $proofImagePath = null;
                if ($request->hasFile('proof_image')) {
                    $file = $request->file('proof_image');
                    // Store locally inside the public disk for testing/verification
                    $filename = 'proof_' . time() . '_' . Str::random(5) . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/proofs'), $filename);
                    $proofImagePath = 'uploads/proofs/' . $filename;
                }

                // Generates a unique enterprise-precision transaction ID
                $txnId = 'TXN-' . date('Ymd') . '-' . strtoupper(Str::random(8));

                // 2. Create the FinancialTransaction record
                $txnStatus = ($gateway->slug === 'card') ? 'completed' : 'under_review';
                $transaction = FinancialTransaction::create([
                    'enterprise_transaction_id' => $txnId,
                    'school_id' => $school->id,
                    'payable_type' => Subscription::class,
                    'payable_id' => $subscription->id,
                    'payment_gateway_id' => $gateway->id,
                    'gateway_snapshot' => $gateway->only(['name', 'slug', 'type', 'credentials']),
                    'amount' => $plan->price,
                    'status' => $txnStatus,
                    'transaction_reference' => $request->transaction_reference ?: ($gateway->slug === 'card' ? 'CARD-' . strtoupper(Str::random(10)) : null),
                    'proof_image_path' => $proofImagePath,
                    'notes' => 'Subscription Checkout: ' . $plan->name,
                ]);

                // 3. If automatic/completed, instantly activate subscription on the school
                if ($txnStatus === 'completed') {
                    $school->update([
                        'subscription_plan' => $plan->name,
                        'subscription_expiry' => $endsAt->format('Y-m-d'),
                    ]);
                }

                return response()->json([
                    'message' => $txnStatus === 'completed' 
                        ? 'Subscription activated successfully!' 
                        : 'Payment submitted successfully! Your account will unlock once manual verification is completed.',
                    'transaction' => $transaction,
                    'subscription' => $subscription,
                    'status' => $txnStatus
                ], 200);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => 'Checkout failed: ' . $e->getMessage()], 500);
        }
    }
}
