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
        Schema::create('tenant_payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id'); // tenant
            $table->foreignId('payment_gateway_id')->constrained('payment_gateways')->onDelete('cascade');
            $table->json('credentials')->nullable(); // Stores API Keys, UPI IDs, Bank details
            $table->string('qr_code_path')->nullable(); // For UPI/Manual QR
            $table->text('instructions')->nullable(); // Instructions for the payer
            $table->boolean('is_active')->default(false); // Can be toggled by School Admin
            $table->timestamps();

            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_payment_gateways');
    }
};
