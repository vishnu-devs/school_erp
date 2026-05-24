<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinancialTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinancialDashboardController extends Controller
{
    /**
     * Get SaaS Revenue Analytics for Super Admin
     */
    public function getRevenueAnalytics(Request $request)
    {
        // Enforce Super Admin Financial Permissions
        $this->authorize('view_financial_reports');

        $metrics = [
            'total_revenue' => FinancialTransaction::where('status', 'completed')->sum('amount'),
            'pending_verifications' => FinancialTransaction::where('status', 'under_review')->count(),
            'failed_transactions' => FinancialTransaction::where('status', 'failed')->count(),
            'refunded_amount' => FinancialTransaction::where('status', 'refunded')->sum('amount'),
        ];

        return response()->json(['metrics' => $metrics]);
    }

    /**
     * Get the queue of manual payments (UPI screenshots) awaiting verification.
     */
    public function getVerificationQueue(Request $request)
    {
        $this->authorize('verify_payments');

        $queue = FinancialTransaction::where('status', 'under_review')
            ->with(['payable']) // Will load Subscription or Fee info
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json($queue);
    }

    /**
     * Approve or Reject a manual payment.
     */
    public function verifyPayment(Request $request, $id)
    {
        $this->authorize('verify_payments');

        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string'
        ]);

        $transaction = FinancialTransaction::findOrFail($id);

        if ($transaction->status !== 'under_review') {
            return response()->json(['error' => 'Transaction is not under review.'], 400);
        }
        DB::transaction(function () use ($transaction, $request) {
            $newStatus = $request->action === 'approve' ? 'completed' : 'rejected';
            
            $transaction->update(['status' => $newStatus]);

            // Log the verification attempt securely
            $transaction->verifications()->create([
                'verified_by' => auth()->id(),
                'status' => $newStatus,
                'notes' => $request->notes,
                'ip_address' => request()->ip(),
            ]);

            // If approved, trigger subscription activation
            if ($newStatus === 'completed') {
                if ($transaction->payable_type === \App\Models\Subscription::class) {
                    $subscription = $transaction->payable;
                    if ($subscription) {
                        $subscription->update(['status' => 'active']);
                        
                        $school = $subscription->school;
                        if ($school) {
                            $school->update([
                                'subscription_plan' => $subscription->plan->name,
                                'subscription_expiry' => $subscription->ends_at->format('Y-m-d')
                            ]);
                        }
                    }
                }
            }
        });
        return response()->json(['message' => "Payment successfully {$request->action}ed."]);
    }
}
