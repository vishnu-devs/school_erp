# Enterprise DevSecOps & CI/CD Pipeline Architecture

## 1. Zero Trust Supply Chain
- **Composer Audit:** On every PR, run `composer audit` to block vulnerable dependencies.
- **NPM Audit:** On every PR, run `npm audit --audit-level=critical`.

## 2. GitHub Actions Deployment Pipeline (SaaS Env)
Your `.github/workflows/deploy.yml` must contain:

```yaml
name: Deploy SaaS Enterprise ERP
on:
  push:
    branches: [ "production" ]
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run PHP Security Audit
        run: composer audit
      - name: Scan Code (SonarQube)
        uses: sonarsource/sonarqube-scan-action@master

  deploy:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v0.1.6
        with:
          host: ${{ secrets.PROD_SERVER_IP }}
          username: ${{ secrets.PROD_SSH_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/schoolites-saas
            git pull origin production
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
```

## 3. Server Requirements (VPS/Cloud Migration)
When migrating off LiteSpeed shared hosting to AWS/DigitalOcean:
- Disable SSH password login (Key-based only).
- Setup Uncomplicated Firewall (UFW): `ufw allow OpenSSH`, `ufw allow 80`, `ufw allow 443`, `ufw enable`.
- Move the database to a private VPC so it has no public IP address.

## 4. Rollback Strategy
If a deployment fails, run the rollback script:
```bash
git reset --hard HEAD~1
composer install --no-dev --optimize-autoloader
php artisan migrate:rollback --step=1
php artisan optimize:clear
```
