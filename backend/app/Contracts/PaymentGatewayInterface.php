<?php

namespace App\Contracts;

use App\Models\FinancialTransaction;

interface PaymentGatewayInterface
{
    /**
     * Initialize a payment session/order.
     * 
     * @param float $amount
     * @param string $currency
     * @param array $metadata
     * @return array Returns gateway-specific data (e.g. order_id, checkout_url)
     */
    public function createOrder(float $amount, string $currency, array $metadata = []): array;

    /**
     * Verify a payment signature/webhook to prevent tampering.
     * 
     * @param array $payload The webhook payload or callback data
     * @param string $signature The signature provided by the gateway
     * @return bool
     */
    public function verifySignature(array $payload, string $signature): bool;

    /**
     * Process a refund for a specific transaction.
     * 
     * @param FinancialTransaction $transaction
     * @param float|null $amount Optional partial refund amount
     * @return bool
     */
    public function processRefund(FinancialTransaction $transaction, ?float $amount = null): bool;
}
