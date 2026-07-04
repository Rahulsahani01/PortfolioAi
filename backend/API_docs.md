# PortfolioAI - API Documentation

**Base URL:** `http://localhost:4000/api`
**Authentication:** Most routes require a valid JWT passed in the `Authorization` header:
`Authorization: Bearer <your_access_token>`

---

## 🔐 1. Authentication (`/auth`)

### `POST /auth/register`
Creates a new user account.
* **Payload:** `{ "email": "user@example.com", "password": "password123", "name": "Rahul" }`
* **Response (201):** `{ "message": "User registered successfully", "accessToken": "eyJ..." }`
* **Notes:** Also sets an `httpOnly` cookie containing the `refreshToken`.

### `POST /auth/login`
Authenticates a user.
* **Payload:** `{ "email": "user@example.com", "password": "password123" }`
* **Response (200):** `{ "message": "Login successful", "accessToken": "eyJ..." }`

### `POST /auth/refresh`
Refreshes an expired access token using the `httpOnly` refresh token cookie.
* **Payload:** None (Requires cookies).
* **Response (200):** `{ "accessToken": "eyJ..." }`

### `POST /auth/logout`
Clears the refresh token cookie.
* **Response (200):** `{ "message": "Logged out successfully" }`

---

## 📄 2. Resumes (`/resumes`)
Requires Authentication.

### `POST /resumes/parse`
Parses a PDF resume strictly in-memory and returns structured JSON data.
* **Headers:** `Content-Type: multipart/form-data`
* **Payload:** `file` (The PDF file)
* **Response (200):** `{ "id": "mock-uuid", "content": { "name": "Rahul", "experience": [...] } }`

---

## 🌐 3. Sites (`/sites`)
Requires Authentication.

### `GET /sites`
Retrieves all draft and live sites belonging to the user.
* **Response (200):** `{ "sites": [ { "id": "...", "slug": "rahul", "status": "DRAFT", ... } ] }`

### `POST /sites`
Creates a new site draft based on a selected template and resume data.
* **Payload:** `{ "slug": "rahul-portfolio", "templateKey": "neon-dark", "resumeId": "<uuid>" }`
* **Response (201):** `{ "message": "Site draft created", "siteId": "..." }`

### `GET /sites/:id`
Retrieves the full custom JSON data for a specific site.
* **Response (200):** `{ "site": { "id": "...", "customData": { ... } } }`

### `PUT /sites/:id`
Updates the custom JSON data for a site (when the user edits their text/colors in the UI).
* **Payload:** `{ "customData": { "name": "Updated Name", "accentColor": "#ff0000" } }`
* **Response (200):** `{ "message": "Site updated successfully", "site": { ... } }`

### `POST /sites/:id/publish`
Queues the site to be compiled and deployed to GitHub. **Protected by the Paywall.**
* **Payload:** None.
* **Response (202):** `{ "message": "Site publishing started. Job added to queue." }`
* **Error (402):** `{ "error": { "message": "Payment Required" } }` (If the user does not have an active subscription).

---

## 💳 4. Billing & Payments (`/billing`)
Requires Authentication.

### `POST /billing/checkout`
Generates a payment intent and returns the UPI ID to pay.
* **Payload:** `{ "amount": 999 }`
* **Response (201):** `{ "message": "...", "paymentId": "uuid", "amount": 999, "upiId": "rahul@okhdfcbank" }`

### `POST /billing/verify`
Submits a UTR transaction number for admin verification.
* **Payload:** `{ "paymentId": "uuid", "utrNumber": "123456789012" }`
* **Response (200):** `{ "message": "UTR submitted successfully. Awaiting admin approval." }`

### `GET /billing/status`
Checks the user's subscription status and whether a payment is pending review.
* **Response (200):** `{ "subscription": { "status": "ACTIVE|INACTIVE" }, "pendingReview": true|false }`

---

## 👑 5. Admin Dashboard (`/admin`)
Requires Authentication **AND** the user's email must match `ADMIN_EMAIL` in `.env`.

### `GET /admin/payments/pending`
Lists all submitted UTRs waiting for verification.
* **Response (200):** `{ "pendingPayments": [ { "id": "...", "amount": 999, "providerId": "123456789012" } ] }`

### `POST /admin/payments/:id/approve`
Approves a UTR, marks the payment as COMPLETED, and activates the user's subscription for 1 year.
* **Payload:** None (ID is in the URL).
* **Response (200):** `{ "message": "Payment approved and Subscription activated successfully!" }`

---

## 🪝 6. Webhooks (`/webhooks`)
Public endpoints for external services to call.

### `POST /webhooks/github-success`
Called by GitHub Actions when a portfolio deployment finishes successfully. Updates the site status to `LIVE`.
* **Payload:** `{ "siteId": "uuid", "deploymentUrl": "https://rahulsahani01.github.io/portfolio" }`
* **Response (200):** `{ "message": "Site marked as live" }`
