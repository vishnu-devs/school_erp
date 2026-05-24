# Automated Backup Strategy

Enterprise data must be backed up securely, encrypted at rest, and stored offsite.

## 1. Implement Laravel Backup
Run the following in your backend terminal:
```bash
composer require spatie/laravel-backup
php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"
```

## 2. Configuration (`config/backup.php`)
- **Database:** Ensure the database is dumped.
- **Files:** Include `storage/app/private` and `storage/app/public` in the backup.
- **Destination:** Set the destination disk to `s3`.

## 3. Storage Configuration (`config/filesystems.php`)
Configure your AWS S3 bucket or a DigitalOcean Space to store the backups securely offsite.

## 4. Automation (Cron Job)
Add the following to your server's Cron tab or cPanel Cron Jobs to run backups automatically at 2:00 AM every day:
```bash
0 2 * * * cd /path-to-your-project/backend && php artisan backup:run >> /dev/null 2>&1
0 3 * * * cd /path-to-your-project/backend && php artisan backup:clean >> /dev/null 2>&1
```

## 5. Security & Encryption
- In `config/backup.php`, enable archive encryption using a strong password.
- Do NOT store the backup archive password in the `.env` file of the server. Keep it in a secure password manager (like 1Password or Bitwarden).
- Test restoration quarterly.
