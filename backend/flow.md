# Site Generation Flow (GitHub Actions + Local Redis Strategy)

This document outlines the architecture and data flow for generating user portfolios by pushing to a central GitHub repository on unique branches and deploying via GitHub Actions, managed by a robust, low-cost local Redis queue.

## High-Level Architecture
When a user publishes their site, the backend will interact with a single "Central Repository" via the GitHub API, create a dedicated branch for that user, and let GitHub Actions handle the final deployment. 

To ensure the Express server never crashes or drops requests when multiple users publish at the same time, we use **BullMQ and Redis** to queue these requests safely in the background.

---

## Step-by-Step Flow

### 1. The Trigger (Frontend -> API)
* The user finishes editing their resume data and clicks the **"Publish"** button.
* The frontend sends a `POST /api/sites/:id/publish` request to your Express backend.

### 2. The Background Job (API -> BullMQ)
* The API updates the PostgreSQL database status to `PUBLISHING`.
* To prevent the Express server from lagging or hitting GitHub API rate limits, it drops a Job containing the user's `siteId`, `templateKey`, and `resume JSON data` into a Redis Queue (BullMQ).
* The API immediately responds with a `202 Accepted` to the frontend, which starts a loading state.

### 3. The GitHub API Worker (BullMQ -> GitHub)
A background worker script, constantly listening to the Redis queue, picks up the job and executes the following using the `octokit` (GitHub API) library:

1. **Branch Creation:** The worker connects to your central GitHub repository. It creates a new branch uniquely named for the user (e.g., `feature/site-rahul-123`).
2. **Code Generation:** The worker compiles the JSON and prepares the files for the template.
3. **The Commit:** The worker commits these files directly into the newly created branch.
4. **Push:** The commit is pushed to the GitHub repository.

*(If the GitHub API fails or glitches during this step, BullMQ automatically waits a few seconds and retries the job so no user data is lost!)*

### 4. The Deployment (GitHub Actions)
* A `.github/workflows/deploy.yml` file is configured in your central repository.
* The workflow is triggered immediately upon any push to a branch matching `feature/site-*`.
* **The Action Pipeline:**
  1. Checks out the specific branch.
  2. Deploys the static HTML/CSS files to your hosting provider (e.g., GitHub Pages, Vercel, or Cloudflare Pages).

### 5. Finalizing the Database (Webhook -> PostgreSQL)
* Once the GitHub Action successfully finishes deploying the site, the final step in the Action is to send a Webhook request back to your backend (e.g., `POST /api/webhooks/github-deploy-success`).
* Your backend receives the webhook and updates the PostgreSQL database:
  * `status`: Changes from `PUBLISHING` to `LIVE`.
* The frontend sees the `LIVE` status and shows the user their completed portfolio link.

---

## Infrastructure Strategy (The $0 Extra Queue)
To support BullMQ without adding expensive hosting costs, we will use Docker on your existing Virtual Private Server (VPS).

1. **The App:** Your Node.js backend runs on your VPS.
2. **The Queue:** We install a Redis Docker Container on the *exact same VPS*. 
3. **The Cost:** Because Redis is written in C and is extremely lightweight (using only 10MB to 50MB of RAM), it can comfortably run alongside your Node.js app using the leftover server resources. This gives you enterprise-grade queue reliability for **$0 extra per month**.
