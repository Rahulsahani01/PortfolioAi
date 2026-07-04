# PortfolioAI - DevOps & Architecture Guide

This document outlines the infrastructure and deployment strategy for the PortfolioAI backend.

## 1. System Architecture

The PortfolioAI backend is a Node.js monolith designed for high throughput, utilizing a background worker pattern to prevent long-running tasks (like GitHub publishing) from blocking the main API thread.

*   **API Layer:** Express.js running on Node.js.
*   **Database:** PostgreSQL (Managed via Prisma).
*   **Message Broker:** Redis (Used strictly for BullMQ).
*   **Worker:** A separate process (or thread) running BullMQ that listens to Redis for jobs and executes heavy API calls to GitHub.

## 2. The Deployment Strategy (VPS)

Instead of using expensive PaaS providers like Vercel or Heroku for the backend, the recommended approach is a **Virtual Private Server (VPS)** like DigitalOcean, Hetzner, or AWS EC2 running Ubuntu.

### Why a VPS?
*   **Cost:** A $5-$10/month VPS can easily run the Node backend, a PostgreSQL container, and a Redis container simultaneously.
*   **Persistent Queues:** BullMQ relies on persistent Redis connections. Serverless environments (like Vercel functions) cannot maintain persistent background connections, making a VPS mandatory for our architecture.

## 3. Containerization Strategy

While the Node.js app *can* be run directly on the host machine using `PM2` (Process Manager 2), the supporting services should be containerized for ease of management.

*   **PostgreSQL:** Run via Docker Compose (or use a managed service like Supabase if preferred).
*   **Redis:** Run via Docker Compose with a persistent volume mounted to ensure queue jobs aren't lost if the server reboots.
*   **Reverse Proxy:** Nginx running on the host machine to route port 80/443 traffic to the internal Node.js port (e.g., 4000) and handle SSL termination via Let's Encrypt (Certbot).

## 4. CI/CD Pipeline (Recommended)

To automate deployments to the VPS:
1.  **GitHub Actions:** Create a `.github/workflows/deploy.yml` file.
2.  **Trigger:** On `push` to the `main` branch.
3.  **Action:** SSH into the VPS, pull the latest code, run `npm install`, `npx prisma migrate deploy`, `npm run build`, and restart the PM2 process (`pm2 restart portfolio-api`).
