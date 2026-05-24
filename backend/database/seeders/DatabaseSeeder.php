<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
use App\Models\StudentClass;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);

        // Seed Default SaaS Plans
        $basicPlan = \App\Models\Plan::create([
            'name' => 'Basic Plan',
            'price' => 2999.00,
            'duration_days' => 30,
            'max_students' => 100,
            'features' => ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings'],
            'is_active' => true,
        ]);

        $proPlan = \App\Models\Plan::create([
            'name' => 'Pro Plan',
            'price' => 5999.00,
            'duration_days' => 30,
            'max_students' => 500,
            'features' => ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings', 'Fees', 'Timetable', 'Exams', 'Notifications', 'Reports'],
            'is_active' => true,
        ]);

        $enterprisePlan = \App\Models\Plan::create([
            'name' => 'Enterprise Plan',
            'price' => 9999.00,
            'duration_days' => 30,
            'max_students' => null, // Unlimited
            'features' => ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Homework', 'Settings', 'Fees', 'Timetable', 'Exams', 'Notifications', 'Reports', 'Library', 'Transport', 'Chat'],
            'is_active' => true,
        ]);

        // Seed Global SaaS Payment Gateways
        \App\Models\PaymentGateway::create([
            'name' => 'UPI Transfer',
            'slug' => 'upi',
            'type' => 'manual',
            'is_active' => true,
            'instructions' => 'Transfer the plan amount to UPI ID: codebyvishu@upi. Please enter your transaction UTR reference and upload a screenshot proof below.',
            'credentials' => ['upi_id' => 'codebyvishu@upi'],
        ]);

        \App\Models\PaymentGateway::create([
            'name' => 'Bank Transfer',
            'slug' => 'bank_transfer',
            'type' => 'manual',
            'is_active' => true,
            'instructions' => 'Deposit the plan amount to HDFC Bank A/C: 50100987654321, IFSC: HDFC0000123, Account Name: CodeByVishu SaaS. Enter deposit reference and upload receipt.',
            'credentials' => [
                'bank_name' => 'HDFC Bank',
                'account_number' => '50100987654321',
                'ifsc' => 'HDFC0000123',
                'account_name' => 'CodeByVishu SaaS'
            ],
        ]);

        \App\Models\PaymentGateway::create([
            'name' => 'Instant Payment Card (Simulated)',
            'slug' => 'card',
            'type' => 'automatic',
            'is_active' => true,
            'instructions' => 'Enter simulated card details below for instant activation of your subscription.',
            'credentials' => ['mode' => 'sandbox'],
        ]);

        // 1. Create a default school first
        $school = School::create([
            'school_name' => 'CodeByVishu School',
            'email' => 'hello@codebyvishu.in',
            'phone' => '1234567890',
            'address' => '123 Education Lane',
            'city' => 'New Delhi',
            'status' => 1,
            'subscription_plan' => 'Basic Plan',
            'subscription_expiry' => now()->addDays(30)->format('Y-m-d'),
        ]);

        // Create initial subscription entry for school
        \App\Models\Subscription::create([
            'school_id' => $school->id,
            'plan_id' => $basicPlan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
        ]);

        // 2. Create the SUPER ADMIN (Owner of the SaaS platform, NOT linked to any school)
        $superAdmin = User::create([
            'name' => 'Platform Super Admin',
            'email' => 'admin@codebyvishu.in',
            'password' => Hash::make('password123'),
            'school_id' => null, // Crucial: Super Admin does not belong to a school
        ]);

        // Temporarily set the Spatie team_id to 0 to bypass the primary key constraint for Super Admin
        setPermissionsTeamId(0);
        $superAdmin->assignRole('Super Admin');

        // 3. Create a SCHOOL ADMIN (Linked to the specific school)
        $schoolAdmin = User::create([
            'name' => 'School Principal',
            'email' => 'principal@codebyvishu.in',
            'password' => Hash::make('password123'),
            'school_id' => $school->id,
        ]);
        
        setPermissionsTeamId($school->id);
        $schoolAdmin->assignRole('School Admin');

        // 4. Create a default class linked to school
        StudentClass::create([
            'school_id' => $school->id,
            'class_name' => '10th Grade',
            'section' => 'A',
        ]);
    }
}
