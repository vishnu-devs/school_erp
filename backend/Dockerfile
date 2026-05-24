FROM richarvey/nginx-php-fpm:latest

# Set working directory inside the container
WORKDIR /var/www/html

# Copy the backend code into the container
COPY . .

# Run composer install during the build phase (saves CPU and prevents port scan timeouts on boot)
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --working-dir=/var/www/html

# Image configuration variables for Nginx and PHP-FPM
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel Specific environment variables
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Ensure the custom launch/deploy scripts are executable
RUN chmod +x scripts/00-laravel-deploy.sh

# Start using the default script provided by the base image
CMD ["/start.sh"]
