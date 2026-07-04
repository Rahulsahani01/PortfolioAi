# Portfolio AI Backend Architecture & Implementation Plan

This document outlines the comprehensive backend implementation strategy for Portfolio AI, based on the provided `requirement.md` specifications and current Next.js frontend setup. 

## 1. Architecture Overview

The system follows a decoupled architecture, separating the client-facing UI from the backend services to ensure independent scalability, especially for compute-intensive tasks like resume parsing and static site generation.

*   **Frontend Client:** Next.js application (currently built).
*   **API Gateway/Core API:** Node.js + Express.js + TypeScript. Handles synchronous client requests (Auth, CRUD operations, billing).
*   **Database Layer:** PostgreSQL managed via Prisma ORM for relational integrity.
*   **Asynchronous Workers:** BullMQ + Redis for processing long-running tasks.
    *   *Worker A (Parser):* Handles PDF/DOCX extraction and AI parsing to JSON.
    *   *Worker B (Generator):* Handles static site compilation and storage upload.
*   **Storage & CDN:** Cloudflare R2 (or AWS S3) for object storage (resumes, generated sites, assets) paired with Cloudflare CDN for fast edge delivery.
*   **Third-Party Services:** An LLM Provider (e.g., OpenAI/Gemini) for resume parsing (Payments handled manually via UPI).

### 1.1 User Journey & Data Flow

To ensure high data accuracy and a seamless user experience, the core data flow follows a 4-step sequence before any publishing occurs:

1.  **Upload:** User uploads their PDF/DOCX resume.
2.  **AI Extract (Parsing Worker):** The backend worker extracts the raw text and sends it to the LLM to structure the data into a strict JSON format.
3.  **User Verify & Edit (Form):** The extracted data is mapped into a detailed frontend form. The user can review the AI's work, fix any hallucinations, and manually fill in missing information (e.g., uploading a profile picture, linking a GitHub profile).
4.  **Preview:** Once verified, the complete and accurate data is instantly passed into the frontend React template components, providing a lightning-fast, 100% accurate WYSIWYG preview of their final website.

## 2. Database Schema

The database will be PostgreSQL, managed using Prisma ORM.

### Models

*   **User:**
    *   `id` (UUID, PK), `email` (String, Unique), `password_hash` (String), `is_verified` (Boolean), `created_at`, `updated_at`.
*   **Resume:**
    *   `id` (UUID, PK), `user_id` (UUID, FK -> User), `file_url` (String), `status` (Enum: UPLOADED, PARSING, COMPLETED, FAILED), `parsed_data` (JSONB), `created_at`.
*   **Site:**
    *   `id` (UUID, PK), `user_id` (UUID, FK), `resume_id` (UUID, FK), `template_key` (String), `slug` (String, Unique), `status` (Enum: DRAFT, PUBLISHING, LIVE), `published_url` (String), `custom_data` (JSONB - overrides to parsed_data), `created_at`.
    *(Note: Template code and configurations are kept in the frontend. The DB only stores the template key).*
*   **Subscription:**
    *   `id` (UUID, PK), `user_id` (UUID, FK), `plan` (Enum: STARTER, BASIC, PRO, PREMIUM), `status` (Enum: ACTIVE, EXPIRED, CANCELLED), `valid_until` (DateTime).
*   **Payment:**
    *   `id` (UUID, PK), `user_id` (UUID, FK), `subscription_id` (UUID, FK), `upi_transaction_id` (String), `screenshot_url` (String, Optional), `amount` (Float), `status` (Enum: PENDING, VERIFIED, REJECTED).

*Indexes:* Unique index on `Site.slug`, index on `User.email`, `Resume.user_id`, and `Site.user_id`.

## 3. API Design

The RESTful API will be structured with Express Routers.

### Auth (`/api/auth`)
*   `POST /register` - Creates user, returns JWT.
*   `POST /login` - Validates credentials, returns JWT (Access) & sets Refresh Token HttpOnly cookie.
*   `POST /refresh` - Issues new access token based on refresh cookie.

### Resumes (`/api/resumes`)
*   `POST /upload` - Multipart form upload (multer). Uploads to R2, creates DB record, triggers Parse Job.
*   `GET /:id` - Poll status or fetch parsed JSON data.
*   `PUT /:id/data` - Save user edits to the extracted JSON fields.

### Sites (`/api/sites`)
*   `GET /` - List user's sites.
*   `POST /` - Initialize a site draft (reserves slug).
*   `PUT /:id` - Update site configuration/data overrides.
*   `POST /:id/publish` - Triggers Site Generation Worker (requires active subscription).
*   `DELETE /:id` - Unpublishes site and deletes R2 bucket folder.
*   `GET /check-slug?slug={handle}` - Verify if a URL slug is available.

### Billing (`/api/billing`)
*   `POST /submit-upi` - Submits a UPI transaction ID and optional screenshot for verification.
*   `POST /admin/verify/:id` - Admin endpoint to manually approve a payment and activate the user's subscription.

## 4. Core Modules

1.  **Authentication Module:** Uses `bcrypt` for hashing and `jsonwebtoken` for signing. Implements middleware for route protection (`requireAuth`) and role-based access.
2.  **File Upload Service:** Uses `multer` and AWS SDK v3 (configured for Cloudflare R2). Generates pre-signed URLs or handles direct buffer streams for PDF/DOCX.
3.  **Parsing Worker (BullMQ):**
    *   *Job:* Download PDF -> Extract raw text -> Send to LLM with rigid JSON schema prompt -> Save validated JSON back to PostgreSQL -> Mark `status: COMPLETED`.
4.  **Site Generation Worker (BullMQ):**
    *   *Job:* Fetch user's parsed JSON & overrides -> Inject into the selected Template React components -> Compile to static HTML/CSS/JS via a builder script -> Upload recursive directory to R2 under `/slug` path -> Invalidate CDN cache.
5.  **Payment Module:** Handles manual UPI transaction submissions. Facilitates admin workflows to verify the UPI payment against the bank statement and activate user subscriptions.

## 5. Security

*   **Auth Strategy:** Short-lived JWT Access Tokens (e.g., 15m) in memory/local storage, long-lived Refresh Tokens (e.g., 7d) in Secure, HttpOnly cookies to prevent XSS.
*   **Input Validation:** Use `Zod` middleware for strictly validating all incoming request bodies and query parameters.
*   **File Security:**
    *   Limit max upload to 10MB.
    *   Validate MIME types and magic numbers for PDF (`%PDF`) and DOCX (`PK\x03\x04`).
*   **Rate Limiting:** Use `express-rate-limit`. Stricter limits on `/login`, `/register`, and `/upload` endpoints.
*   **CORS:** Strict origin configuration allowing only the Next.js frontend domain.

## 6. Infrastructure

*   **Hosting:** Dockerized backend and worker. Can be deployed on AWS ECS, Render, or Railway.
*   **Database:** Managed PostgreSQL (e.g., Neon or Supabase) with connection pooling (PgBouncer).
*   **Queueing:** Managed Redis instance (e.g., Upstash or ElastiCache).
*   **Static Hosting (Generated Sites):** Cloudflare R2 bucket (`sites.portfolio.ai`), heavily cached at the edge via Cloudflare CDN. Users access `username.portfolio.ai` handled via Cloudflare Page Rules/Workers routing to R2.
*   **CI/CD:** GitHub Actions to run ESLint, Jest tests, build Docker images, and deploy.

## 7. Implementation Phases

*   **Phase 1: Foundation (Days 1-3)**
    *   Initialize Express + TS codebase.
    *   Configure Prisma schema and deploy migrations.
    *   Setup global error handling, logging (Winston/Pino), and Zod validation.
*   **Phase 2: Auth & Storage (Days 4-6)**
    *   Implement Registration, Login, JWT logic.
    *   Integrate AWS SDK for R2 uploads.
    *   Build the Resume Upload API endpoint.
*   **Phase 3: Parsing Queue (Days 7-10)**
    *   Setup Redis + BullMQ.
    *   Write the Parsing Worker logic (Text extraction + LLM integration).
    *   Implement frontend polling/WebSockets to get parsing status.
*   **Phase 4: Site Generation (Days 11-15)**
    *   Develop the static generation pipeline (React to static HTML script).
    *   Write the Generator Worker logic (Compile + R2 bulk upload).
    *   Publish/Unpublish API endpoints.
*   **Phase 5: Monetization (Days 16-18)**
    *   Implement UPI payment submission endpoints.
    *   Build simple Admin dashboard for verifying and approving UPI transactions.

## 8. Risks & Mitigations

*   **Risk:** AI parsing is slow or fails due to complex PDF formats.
    *   **Mitigation:** Process asynchronously via BullMQ. Provide the user a fallback manual-entry form if parsing fails or misses data. Use a robust PDF extraction library (e.g., `pdf2json` or `pdf-parse`) before sending raw text to the LLM.
*   **Risk:** Static Site Generation is computationally heavy and blocks the event loop.
    *   **Mitigation:** Site generation *must* happen in a completely isolated Worker process, not the main Express API server.
*   **Risk:** Malicious users upload executable code via the Resume parser.
    *   **Mitigation:** Strict magic number validation on files. Do not allow executing any user-uploaded files. The LLM output MUST be strictly coerced to a JSON schema (e.g., OpenAI Function Calling) before saving.
*   **Risk:** Subdomain/Slug collision.
    *   **Mitigation:** Unique database constraint on `Site.slug`. The `/check-slug` API must query live DB before allowing user reservation.

> [!IMPORTANT]
> **User Review Required:**
> 1. Does this architecture align with your expected hosting budget and scale (e.g., using Cloudflare R2 + Redis + Postgres)? 
> 2. For Phase 4 (Site Generation), do you prefer generating vanilla HTML/CSS from templates, or programmatically running a lightweight Next.js static export for each user? (The plan assumes compiling React templates to static HTML).
