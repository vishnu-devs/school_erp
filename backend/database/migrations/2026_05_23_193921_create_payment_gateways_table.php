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
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. Razorpay, UPI, Bank Transfer
            $table->string('slug')->unique(); // e.g. razorpay, upi, bank_transfer
            $table->string('type'); // automatic, manual
            $table->boolean('is_active')->default(true);
            $table->string('icon')->nullable(); // URL to gateway logo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
