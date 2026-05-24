#!/usr/bin/env bash
echo "Caching Laravel assets..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

echo "Checking if seeding is required..."
php artisan tinker --execute="if (\App\Models\User::count() === 0) { \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]); echo 'Database seeded successfully!'; } else { echo 'Database already seeded, skipping.'; }"
