# Per-Site Billing & Publishing Flow

Based on your audio instructions, here is the exact step-by-step architecture and database flow for how users will pay for and publish individual sites:

## 1. Site Creation (Draft Phase)
* **Trigger:** The user selects a template and clicks "Continue".
* **Action:** An entry is created in the `Site` table.
* **Database State:** 
  * The `Site` row stores the `templateKey`, `userId`, `resumeId`, and custom data.
  * **NEW:** The `Site` table will have a `subscriptionId` column. At this stage, `subscriptionId` is **NULL** because they haven't paid yet.

## 2. Payment Initiation
* **Trigger:** The user hits the paywall, scans the QR code, enters their UTR number, and submits.
* **Action:** An entry is created in the `Payment` table.
* **Database State:**
  * The `Payment` row stores the UTR number, amount, and is linked to the specific `siteId` they are trying to publish.
  * The `status` is set to `PENDING`.
  * The `subscriptionId` in the `Payment` table is **NULL** (since the subscription hasn't been generated/verified yet).

## 3. Admin Verification & Subscription Linking
* **Trigger:** You (the Admin) verify the UTR and click "Approve".
* **Action:** The system processes the approval in a transaction.
* **Database State:**
  1. **Payment Update:** The `Payment` status is marked as `VERIFIED`.
  2. **Subscription Creation:** A new active `Subscription` record is created for this specific payment.
  3. **Site Update:** The `Site` table is updated. The previously NULL `subscriptionId` column on the `Site` is now updated to hold the ID of the newly created Subscription.

## 4. Publishing
* **Trigger:** Because the Site now has a valid `subscriptionId`, the system allows the publish action.
* **Action:** The site generation worker pushes the code to GitHub.
* **Database State:**
  * Once GitHub Actions finishes building the site, the webhook returns the live URL.
  * The `Site` table is updated again, changing status to `LIVE` and saving the final `publishedUrl`.

---

This perfectly aligns with the implementation plan I just proposed! I will update the Prisma schema to exactly match this logic (adding the nullable `subscriptionId` to both `Site` and `Payment`). 

Shall I proceed with writing the code to execute this exact flow?
