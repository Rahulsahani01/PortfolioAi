# PortfolioAI - Frontend User Flow & API Mapping

This document maps the exact step-by-step user journey on the frontend to the specific backend API endpoints you need to call. Use this as your blueprint when building the React application.

---

## 1. Onboarding (Auth)
The user arrives at the site and needs an account to save their progress.

* **User Action:** Enters Email, Name, and Password.
* **Frontend Action:**
  * Call `POST /api/auth/register` (or `/login`).
  * **Important:** The backend returns an `accessToken` (valid for 15 mins) and sets an `httpOnly` cookie for the `refreshToken`.
  * Store the `accessToken` in memory (Zustand/Redux) and attach it as a header `Authorization: Bearer <token>` to all future API calls.

## 2. Data Ingestion (Resume Upload)
The user wants to generate their portfolio data automatically.

* **User Action:** Uploads a PDF resume.
* **Frontend Action:** 
  * Create a `FormData` object and append the file.
  * Call `POST /api/resumes/parse` (Ensure `Content-Type: multipart/form-data`).
  * The API instantly returns a structured JSON object (`mockParsedData`).
  * **UI Update:** Use this JSON to instantly auto-fill the user's "Edit Details" form on the screen.

## 3. Customization (Templates & Editing)
The user fixes any typos in their auto-filled form and picks a design.

* **User Action:** Edits form fields and clicks a template thumbnail (e.g., "Neon Dark").
* **Frontend Action:**
  * When they click "Save Draft" or "Next", call `POST /api/sites`.
  * Payload: `{ "slug": "rahul", "templateKey": "neon-dark", "resumeId": "<uuid>" }`
  * (Optional): Call `GET /api/sites/check-slug?slug=rahul` first to ensure the URL isn't taken.
  * Store the returned `siteId` in React state.

* **User Action (Later):** If they edit their data again.
  * Call `PUT /api/sites/:id`.
  * Payload: `{ "customData": <their updated JSON state> }`

## 4. The Publish Attempt (The Paywall)
The user is happy with their live preview and clicks "Publish Live".

* **User Action:** Clicks "Publish".
* **Frontend Action:**
  * Call `POST /api/sites/:id/publish`.
  * **Scenario A (Success - 202 Status):** They are a paid user! Show a loading spinner. The site is publishing to GitHub.
  * **Scenario B (Paywall - 402 Status):** The backend blocked them. 
    * **UI Update:** Stop the loading spinner and pop open the "Upgrade to Pro" Payment Modal.

## 5. The Checkout Flow (Manual UPI)
The user hit the paywall and decides to pay.

* **Frontend Action (Automatic):** When the modal opens, immediately call `POST /api/billing/checkout` with `{ "amount": 999 }`.
* **UI Update:** Display the returned `upiId` and `amount` as a QR code or text.
* **User Action:** Scans QR code, pays on phone, types the 12-digit UTR into your form, and clicks "Verify".
* **Frontend Action:**
  * Call `POST /api/billing/verify`.
  * Payload: `{ "paymentId": "<id>", "utrNumber": "123456789012" }`
* **UI Update:** Show a "Success! Your payment is under review" screen.

## 6. The Waiting Game (Polling)
The user is waiting for you (the Admin) to approve the payment.

* **Frontend Action:**
  * Every 10 seconds, call `GET /api/billing/status`.
  * If the response says `subscription.status === 'ACTIVE'`, they are approved!
  * **UI Update:** Show confetti! Automatically re-trigger the `POST /api/sites/:id/publish` endpoint because they are now a paid user.

---

## 7. The Admin Flow (For YOU only)
You need to approve the payments. You can build a secret dashboard for yourself at `/admin`.

* **Frontend Action:**
  * Log in using your `ADMIN_EMAIL`.
  * Call `GET /api/admin/payments/pending` to see all users waiting for approval.
  * Match their UTR to your bank SMS.
  * Click "Approve".
  * Call `POST /api/admin/payments/:id/approve`.
  * The user instantly gets their Pro access.
