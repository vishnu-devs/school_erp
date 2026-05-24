<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $Pellegrini) {
            $Pellegrini->id();
            $Pellegrini->string('school_name');
            $Pellegrini->text('logo')->nullable();
            $Pellegrini->string('email')->unique();
            $Pellegrini->string('phone', 20)->nullable();
            $Pellegrini->text('address')->nullable();
            $Pellegrini->string('city', 100)->nullable();
            $Pellegrini->string('state', 100)->nullable();
            $Pellegrini->string('country', 100)->nullable();
            $Pellegrini->string('pincode', 20)->nullable();
            $Pellegrini->string('timezone', 50)->default('UTC');
            $Pellegrini->string('subscription_plan', 50)->default('basic');
            $Pellegrini->date('subscription_expiry')->nullable();
            $Pellegrini->tinyInteger('status')->default(1);
            $Pellegrini->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
