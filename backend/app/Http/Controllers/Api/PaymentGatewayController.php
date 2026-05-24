<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\TenantPaymentGateway;
use Illuminate\Http\Request;

class PaymentGatewayController extends Controller
{
    /**
     * Get the configured payment gateways for the current user.
     * If Super Admin, fetch from `payment_gateways`.
     * If School Admin, fetch from `tenant_payment_gateways`.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (is_null($user->school_id)) {
            // Super Admin
            $gateways = PaymentGateway::all();
            return response()->json($gateways);
        } else {
            // School Admin
            $gateways = TenantPaymentGateway::with('paymentGateway')->where('school_id', $user->school_id)->get();
            return response()->json($gateways);
        }
    }

    /**
     * Configure a payment gateway.
     */
    public function configure(Request $request)
    {
        $request->validate([
            'slug' => 'required|string', // e.g. razorpay, upi, bank
            'credentials' => 'required|array',
        ]);

        $user = $request->user();

        if (is_null($user->school_id)) {
            // Super Admin configuring SaaS gateways
            $gateway = PaymentGateway::firstOrCreate(
                ['slug' => $request->slug],
                [
                    'name' => ucfirst($request->slug),
                    'type' => $request->slug === 'razorpay' ? 'automatic' : 'manual',
                    'is_active' => true,
                ]
            );

            $gateway->update([
                'credentials' => $request->credentials,
                'is_active' => true
            ]);

            return response()->json(['message' => 'Platform Payment Gateway configured successfully', 'gateway' => $gateway]);

        } else {
            // School Admin configuring fee gateways
            $globalGateway = PaymentGateway::firstOrCreate(
                ['slug' => $request->slug],
                [
                    'name' => ucfirst($request->slug),
                    'type' => $request->slug === 'razorpay' ? 'automatic' : 'manual',
                ]
            );

            $tenantGateway = TenantPaymentGateway::updateOrCreate(
                [
                    'school_id' => $user->school_id,
                    'payment_gateway_id' => $globalGateway->id
                ],
                [
                    'credentials' => $request->credentials,
                    'is_active' => true
                ]
            );

            return response()->json(['message' => 'School Payment Gateway configured successfully', 'gateway' => $tenantGateway]);
        }
    }
}
