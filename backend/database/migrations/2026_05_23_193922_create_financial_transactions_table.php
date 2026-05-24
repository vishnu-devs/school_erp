<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('enterprise_transaction_id')->unique(); // TXN-2026-SCH-000001
            $table->unsignedBigInteger('school_id')->nullable(); // null for Super Admin transactions, set for Tenant transactions
            
            // Polymorphism: Who/What is being paid for (Subscription, FeePayment)
            $table->morphs('payable');
            
            // Payment Gateway info
            $table->foreignId('payment_gateway_id')->nullable()->constrained('payment_gateways')->onDelete('set null');
            $table->json('gateway_snapshot')->nullable(); // Immutable snapshot of receiver details at time of payment
            
            $table->decimal('amount', 20, 8); // Enterprise Money Precision
            $table->json('tax_breakdown')->nullable(); // GST tracking
            
            $table->string('status')->default('initiated'); // initiated, pending, under_review, verified, completed, failed, rejected, refunded, cancelled
            
            // Proof & References
            $table->string('transaction_reference')->nullable()->unique(); // UTR / Razorpay payment ID
            $table->string('idempotency_key')->nullable()->unique(); // To prevent duplicate transaction processing
            $table->string('proof_image_path')->nullable();
            $table->string('proof_image_hash')->nullable(); // To prevent duplicate screenshot uploads
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes(); // Strict immutability requirement

            if (Schema::hasTable('schools')) {
                $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_transactions');
    }
};
