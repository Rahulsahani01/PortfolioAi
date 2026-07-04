# Running the Server in Production (VPS)

This guide is for the DevOps engineer setting up PortfolioAI on a fresh Ubuntu VPS (DigitalOcean, AWS, etc.).

## 1. Server Setup & Dependencies
SSH into the server and install required packages:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Docker & Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
```

## 2. Start Supporting Services (Redis & Database)
Create a `docker-compose.yml` file anywhere on the server to run Redis securely:
```yaml
version: '3.8'
services:
  redis:
    image: redis:latest
    command: redis-server --requirepass "YourSuperSecretRedisPassword"
    ports:
      - "127.0.0.1:6379:6379" # Only expose to localhost
    volumes:
      - redis_data:/data # Crucial for persistent queues!
volumes:
  redis_data:
```
Run it:
```bash
docker-compose up -d
```

## 3. Prepare the Application
Clone the repo and install dependencies:
```bash
git clone <repo-url>
cd portfolioAi/backend
npm install
```

### ⚠️ CRITICAL STEP: RESTORE BULLMQ ⚠️
The developer disabled Redis locally. You MUST restore it for production:
1. Open `src/server.ts` and UNCOMMENT `import './workers/publish.worker';`
2. Open `src/queues/publish.queue.ts` and replace the mock code with the real BullMQ `Queue` and `IORedis` connection.

## 4. Environment Variables
Create the `.env` file on the server. Ensure you include the Redis password you set in step 2:
```env
PORT=4000
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="production-secret"
ADMIN_EMAIL="rahul@admin.com"

# REDIS CONNECTION
REDIS_URL="redis://:YourSuperSecretRedisPassword@127.0.0.1:6379"

GITHUB_TOKEN="ghp_token"
GITHUB_REPO_OWNER="username"
GITHUB_REPO_NAME="repo"
```

## 5. Build and Start
Build the TypeScript code and start it using PM2 to keep it alive forever:
```bash
npx prisma migrate deploy
npm run build
pm2 start dist/server.js --name "portfolio-api"
pm2 save
pm2 startup
```

## 6. Nginx & SSL (Reverse Proxy)
Install Nginx and route traffic from Port 80 to Port 4000.
```bash
sudo apt-get install nginx certbot python3-certbot-nginx
```
Configure `/etc/nginx/sites-available/default` to proxy requests to `http://localhost:4000`.
Finally, secure it with Let's Encrypt:
```bash
sudo certbot --nginx -d api.yourdomain.com
```
