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
        Schema::create('tenant_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id'); // our stancl tenant_id
            $table->string('short_name')->nullable();
            $table->string('slogan')->nullable();
            
            // Branding
            $table->string('primary_color')->default('#4f46e5'); // indigo-600
            $table->string('secondary_color')->default('#1e293b'); // slate-800
            $table->string('favicon')->nullable();
            $table->string('login_background')->nullable();
            
            // Director Profile
            $table->boolean('show_director')->default(false);
            $table->string('director_name')->nullable();
            $table->string('director_photo')->nullable();
            $table->text('director_message')->nullable();
            
            // Principal Profile
            $table->boolean('show_principal')->default(false);
            $table->string('principal_name')->nullable();
            $table->string('principal_photo')->nullable();
            $table->text('principal_message')->nullable();

            // Contact Info
            $table->string('support_email')->nullable();
            $table->string('website_url')->nullable();
            $table->json('social_links')->nullable();
            
            $table->timestamps();
            
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_profiles');
    }
};
