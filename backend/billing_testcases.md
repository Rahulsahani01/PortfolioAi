# QA Test Cases: Manual UPI Billing Flow

**Objective:** Verify the end-to-end functionality, security, and edge cases of the Manual UPI Payment and Admin Verification flow (Phase 5).

---

## 1. Positive Test Cases (Happy Path)

| Test ID | Scenario | Pre-conditions | Actions | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Create Checkout Intent | User is logged in | Send `POST /api/billing/checkout` with `{ "amount": 999 }` | Returns `201 Created` with a `paymentId` and `status: PENDING`. |
| **TC-02** | Submit Valid UTR | `paymentId` exists in PENDING state | Send `POST /api/billing/verify` with `{ "paymentId": "<id>", "utrNumber": "123456789012" }` | Returns `200 OK`. Payment record is updated with the UTR number in the database. |
| **TC-03** | View Pending Payments (Admin) | Admin is logged in. A UTR was submitted. | Send `GET /api/admin/payments/pending` | Returns `200 OK` with a list containing the user's pending payment and UTR. |
| **TC-04** | Approve Payment (Admin) | Admin sees pending payment | Send `POST /api/admin/payments/<id>/approve` | Returns `200 OK`. User's `Subscription` is created/updated to `ACTIVE` for 1 year. Payment status becomes `COMPLETED`. |
| **TC-05** | Publish After Payment | Subscription is `ACTIVE` | Send `POST /api/sites/<id>/publish` | Returns `202 Accepted`. Job is sent to BullMQ queue successfully. |

---

## 2. Negative Test Cases & Edge Cases

### A. Input Validation (Zod)
| Test ID | Scenario | Actions | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-06** | Invalid UTR Length (Too short) | Send `/verify` with `utrNumber: "12345"` | Returns `400 Bad Request` (Zod error: must be exactly 12 digits). |
| **TC-07** | Invalid UTR Length (Too long) | Send `/verify` with `utrNumber: "1234567890123"` | Returns `400 Bad Request` (Zod error: must be exactly 12 digits). |
| **TC-08** | Non-Numeric UTR | Send `/verify` with `utrNumber: "1234ABCD9012"` | Returns `400 Bad Request` (Zod error: must contain only numbers). |
| **TC-09** | Negative Amount Checkout | Send `/checkout` with `amount: -500` | Returns `400 Bad Request` (Zod error: amount must be greater than 0). |

### B. Security & Authorization
| Test ID | Scenario | Actions | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-10** | Verify Another User's Payment | User A logs in. Attempts to `/verify` using User B's `paymentId`. | Returns `404 Not Found` or `Unauthorized`. User cannot modify payments they don't own. |
| **TC-11** | Non-Admin Accessing Admin Routes | Normal User logs in. Attempts to call `GET /api/admin/payments/pending`. | Returns `403 Forbidden`. The `admin.middleware.ts` successfully blocks them. |
| **TC-12** | Unauthenticated Checkout | User logs out. Attempts to call `POST /api/billing/checkout`. | Returns `401 Unauthorized`. |

### C. State Machine & Business Logic
| Test ID | Scenario | Actions | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-13** | The Publish Paywall (Unpaid) | User has NO active subscription. Clicks publish (`POST /api/sites/<id>/publish`). | Returns `402 Payment Required`. Prevents free users from deploying. |
| **TC-14** | The Publish Paywall (Expired) | User's subscription `endDate` is in the past. Clicks publish. | Returns `402 Payment Required`. Prevents expired users from deploying. |
| **TC-15** | Double UTR Submission | User submits UTR. Then calls `/verify` *again* with a different UTR for the same `paymentId`. | Returns `200 OK` (Overwrites the old UTR in DB), OR `400 Bad Request` depending on strictness rules. *(Currently overwrites, which is fine before admin approval).* |
| **TC-16** | Admin Approves Already Approved Payment | Admin attempts to call `/approve` on a payment that is already `COMPLETED`. | Returns `400 Bad Request` (Payment is already completed). Prevents double-extending the subscription accidentally. |
| **TC-17** | Verify Completed Payment | User attempts to call `/verify` on a `paymentId` that the admin has already marked `COMPLETED`. | Returns `400 Bad Request` (Payment is already COMPLETED). Prevents users from changing UTR on historical records. |
