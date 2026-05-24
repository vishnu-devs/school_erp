<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('admission_no', 100)->unique();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->string('roll_number', 50)->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('parent_phone', 20)->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->string('religion', 100)->nullable();
            $table->string('category', 100)->nullable();
            $table->foreignId('transport_route_id')->nullable(); // Link later
            $table->date('admission_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
