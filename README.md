
# Aggregator News App

**Description**

This News Aggregator application collects and displays news articles by scraping data from multiple external news APIs. Currently, it integrates with three major news APIs: NewsAPI, The Guardian, and The New York Times. The application is designed to be easily extensible, allowing additional APIs to be added by simply updating the config/news_source file.

The front end is built using React, employing Redux and Redux Toolkit for efficient state management. The backend is powered by Laravel and MySQL, utilizing Redis for job queueing to improve the performance and retry efficiency when scraping external APIs. This ensures smooth operation and reliability when handling large volumes of data or retries during network or API failures.

The system is designed for scalability and performance, making it an ideal solution for aggregating and presenting news content from multiple trusted sources.

## Prerequisites

- Docker: [Download Docker](https://www.docker.com/get-started)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url> 
   ```

2. **Create a .env file:**

   Create a `.env` file in the project root directory by copying the `.env.example` file:

   ```bash
   cp .env.dist .env
   ```

3. **Replace the placeholder values in `.env` with your actual configuration:**

    - `APP_ENV` (e.g., local, staging, production)
    - `APP_URL` (your application URL)
    - `APP_DEBUG` (boolean, true for development, false for production)
    - Database credentials (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
    - `DB_CONNECTION` (database driver, e.g., mysql)
    - `QUEUE_CONNECTION` (set to redis to use Redis for job queueing)
    - `REDIS_HOST` (Redis server host)
    - `REDIS_PORT` (Redis server port)
    - `DOMAIN` (your domain name)
    - `DB_ROOT_PASSWORD` (MySQL root password) please add all the news url and keys variable to the .env

## Running the Application

1. **Build and start the application:**

   ```bash
   docker-compose up -d 
   ```
1.2 ** Move to API container and install packages:**

   ```bash
  docker compose exec backend-php bash 
   ```
   ```bash
    composer install
    php artisan migrate
    php artisan db:seed
   ```
1.3 ** Move to Frontend container and install packages:**

   ```bash
  yarn install
   ```
1.4 ** run the command to scrap fresh data:**

   ```bash
  docker compose exec backend-php php artisan queue:work redis
  docker compose exec backend-php php artisan news:aggregate
   ```
1.5 ** run the command to to build react :**

   ```bash
  docker compose exec frontend-react yarn build
   ```
2. **Access the application:**

    - Frontend: `http://newsaggregator.localhost/` (replace with your actual domain)
    - PhpMyAdmin: `http://pma.newsaggregator.localhost` (replace with your actual domain
    - PhpMyAdmin: `http://api.newsaggregator.localhost` (replace with your actual domain)

## Available Commands

- `docker compose up -d`: Starts all services in detached mode.
- `docker compose down`: Stops all running services.
- `docker compose down -v --remove-orphans`: Stops services, removes volumes, and deletes orphaned containers.
- `docker compose up -d --force-recreate --build`: Rebuilds images and recreates all containers (useful for development).
- `docker compose exec backend-php bash`: Connects to the backend PHP container's bash shell.
- `docker compose exec backend-php composer --run console doctrine:migrate:migrate -n`: Runs database migrations.
- `docker compose exec backend-php composer -- dumpautoload`: Updates the Composer autoloader.

## Using Redis for Job Queues

This project utilizes Redis as a high-performance, persistent message broker for handling asynchronous tasks.

### Configuration:
- In your Laravel project's `.env` file, set `QUEUE_CONNECTION` to `redis`.
- Configure the Redis connection details (host, port) in the same file.

### Job Processing:
- Use Laravel's built-in queue functionalities (e.g., `dispatch`, `queue:work`) to enqueue and process jobs.
- Redis ensures reliable job execution, even in case of worker restarts or failures.

## CI/CD Tools

- `docker compose exec backend-php composer --run phpmd`: Runs static code analysis with PHPMD.
- `docker compose exec backend-php composer --run cs-fix`: Fixes code style issues with PHP CodeSniffer.
- `docker compose exec backend-php composer --run cs-check`: Checks code style without fixing.
- `docker compose exec backend-php composer --run phpstan`: Runs static type analysis with PHPStan.
- `docker compose ci`: Runs all CI tools (code style, static analysis).
