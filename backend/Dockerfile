FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    libssl-dev \
    cron \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
       pdo \
       pdo_mysql \
       gd \
       zip \
       exif \
       intl \
       pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set permissions for storage and cache
RUN chmod -R 775 storage bootstrap/cache

# Expose port for PHP-FPM
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
