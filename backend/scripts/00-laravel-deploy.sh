#!/usr/bin/env bash
echo "Caching Laravel assets..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
# Run migrations with a fallback so that Nginx still boots even if the database is not configured yet
if php artisan migrate --force; then
    echo "Migrations completed successfully!"
    
    echo "Checking if seeding is required..."
    php artisan tinker --execute="if (\App\Models\User::count() === 0) { \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]); echo 'Database seeded successfully!'; } else { echo 'Database already seeded, skipping.'; }"
else
    echo "---------------------------------------------------------------------------------"
    echo "WARNING: Migrations failed!"
    echo "This usually means the database is not yet created, or the database environment variables"
    echo "have not been fully configured in the Render Dashboard yet."
    echo "We will still boot the web server so you can access the application and debug."
    echo "---------------------------------------------------------------------------------"
fi
