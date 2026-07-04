# Future Enhancement: Highly Scalable Site Deployment (Cloudflare R2)

*This document outlines the target architecture for Portfolio AI's site generation once the user base scales beyond the limitations of GitHub Actions concurrency and API limits.*

## The Scaling Problem
The V1 approach uses GitHub Actions and branch-creation per user. As the platform hits 1,000+ concurrent users, this architecture will hit bottlenecks:
1. **GitHub API Limits:** 5,000 requests per hour.
2. **Action Queues:** Users will wait minutes for their sites to build due to the 20-job concurrent limit on GitHub.
3. **Git Clutter:** Thousands of branches will slow down repository operations.

## The Target Architecture (Cloudflare R2 + BullMQ)
To achieve infinite scale with immediate deployment times, we will migrate the build process entirely in-house using a highly scalable worker architecture and Edge storage.

### 1. The Queue (Redis + BullMQ)
* Instead of relying on GitHub to queue deployments, we host our own Redis cluster.
* When a user hits "Publish", the API drops a job into BullMQ.
* We can spin up 1, 10, or 100 isolated Docker containers (Workers) to listen to this queue. This gives us complete control over concurrency limits (e.g., building 100 sites simultaneously).

### 2. The In-House Builder (The Worker)
* The GitHub Action is completely removed.
* Our custom Dockerized Node.js Worker picks up the job.
* The Worker pulls the `templateKey` and the user's `resumeJSON`.
* It runs a high-speed bundler (like `Vite` or `esbuild`) locally inside the Docker container to compile the static HTML/CSS files in memory or in a temporary `/tmp/` directory.

### 3. Edge Storage Upload (AWS SDK -> Cloudflare R2)
* The Worker takes the compiled HTML folder and uses the `@aws-sdk/client-s3` library to push the files directly to a **Cloudflare R2 Bucket**.
* **Why R2?**
  * Zero egress fees (unlike AWS S3).
  * Infinitely scalable storage.
  * Direct integration with Cloudflare's massive global CDN network.

### 4. CDN Routing (Cloudflare Page Rules / Workers)
* The R2 bucket (e.g., `portfolio-ai-sites`) contains folders named by the user's slug (e.g., `/rahul`).
* A Cloudflare Worker sits in front of the bucket. When a visitor goes to `rahul.portfolio.ai`, the Cloudflare Worker intercepts the request, rewrites the URL to point to the `/rahul/index.html` file inside the R2 bucket, and serves it instantly from the edge cache.

## Migration Steps (When Ready)
1. **Setup R2:** Create the bucket in the Cloudflare dashboard and generate S3-compatible API credentials.
2. **Build the Docker Worker:** Write the Node.js script that replaces the GitHub Action (doing the Vite build locally).
3. **Deploy Workers:** Host the Docker containers on a scalable platform like AWS ECS, Render, or Railway.
4. **Update the API:** Point the `POST /publish` API to drop jobs into this new BullMQ queue instead of calling the GitHub API.
5. **Setup DNS:** Configure the wildcard DNS (`*.portfolio.ai`) in Cloudflare to route through a Cloudflare Worker proxying to the R2 bucket.
