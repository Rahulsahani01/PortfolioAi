# PortfolioAI - Backend API 🚀

The backend engine powering PortfolioAI. This service handles user authentication, in-memory PDF resume parsing, strict data validation, manual UPI billing workflows, and asynchronous GitHub branch deployments for static site generation.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (via Prisma ORM)
* **Background Jobs:** BullMQ + Redis (Dockerized)
* **Validation:** Zod
* **GitHub Integration:** Octokit REST API
* **Security:** JWT (Access/Refresh Tokens), bcryptjs

---

## ✨ Core Features

1. **Robust Authentication:** Secure dual-token JWT architecture with strict `httpOnly` cookie management.
2. **Ephemeral Resume Parsing:** Parses uploaded PDF resumes completely in memory (RAM) and instantly discards the file. No long-term storage of user PDFs required.
3. **The Paywall & Billing System:** A fully featured manual UPI billing flow. Enforces a strict paywall block (`402 Payment Required`) on the `/publish` endpoint for free users, and provides a secret Admin verification workflow.
4. **Asynchronous Site Publishing:** Uses BullMQ to queue "Publish" jobs. A dedicated worker creates personalized GitHub branches, commits user JSON data, and triggers GitHub Action deployments in the background without blocking the main API.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v18+)
* **PostgreSQL** (Running locally or via cloud like Supabase/Neon)
* **Docker** (Required to run the local Redis container for the background worker)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd portfolioAi/backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolioai?schema=public"

# Security
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_EMAIL="rahul@admin.com" # Required for Admin Dashboard access

# Redis (For Background Worker)
REDIS_URL="redis://localhost:6379"

# GitHub Deployment Worker
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_REPO_OWNER="rahulsahani01"
GITHUB_REPO_NAME="portfolio-deployments"
```

### 3. Database Setup (Prisma)
Initialize your PostgreSQL database with the Prisma schema:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start Redis (via Docker)
The background worker requires Redis to queue jobs. Start it easily with Docker:
```bash
docker run -d --name redis-stack -p 6379:6379 redis/redis-stack:latest
```
*(Note: If Docker is broken on your local machine, refer to `issue.md` for instructions on how to mock the queue locally).*

### 5. Start the Server
```bash
npm run dev
```
The API will be available at `http://localhost:4000`.

---

## 📜 Available Scripts

* `npm run dev` - Starts the development server with `ts-node-dev` (auto-reloading).
* `npm run build` - Compiles the TypeScript code into the `/dist` folder.
* `npm start` - Runs the compiled production code (`node dist/server.js`).

---

## 📚 API Documentation

### Interactive Swagger UI
The backend includes an interactive Swagger interface where you can test all the endpoints, view request payloads, and see expected responses. 
Once the server is running, visit:
👉 **[http://localhost:4000/api-docs](http://localhost:4000/api-docs)**

### Workflow Guides
A detailed breakdown of how the frontend interacts with this API (User Flows, Endpoint Mappings) is available in [user_flow.md](./user_flow.md).

For QA Testing and Edge Cases regarding the Billing system, refer to [billing_testcases.md](./billing_testcases.md).
