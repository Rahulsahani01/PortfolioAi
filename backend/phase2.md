# Phase 2: Authentication & Storage - Flow Documentation

This document outlines the detailed architecture and API flow for the Authentication module implemented in the Portfolio AI backend.

## Architecture & Security Approach

Our authentication system is designed with security and statelessness in mind, using JSON Web Tokens (JWT).

1. **Passwords:** Stored securely in PostgreSQL using `bcrypt` hashing. Raw passwords are never logged or stored.
2. **Access Tokens (JWT):** 
   - Short-lived (expires in 15 minutes).
   - Returned in the standard JSON response body upon login/registration.
   - The React frontend must store this in memory and send it in the `Authorization: Bearer <token>` header for protected routes.
3. **Refresh Tokens (JWT):**
   - Long-lived (expires in 7 days).
   - Never exposed to JavaScript. Sent automatically as an `HttpOnly`, `Secure` cookie to the user's browser.
   - Used to securely obtain a new Access Token when the old one expires, protecting against XSS (Cross-Site Scripting) attacks.

---

## Endpoint Flows

### 1. `POST /api/auth/register`
**Purpose:** Create a new user account.

**Flow:**
1. Request hits `validateRequest(registerSchema)`. Zod ensures `email` is valid and `password` is strong enough.
2. Controller checks if `email` already exists in the database. If so, returns `400 Conflict`.
3. Hashes the `password` using `bcrypt`.
4. Creates a new `User` record in PostgreSQL via Prisma.
5. Generates an Access Token and a Refresh Token.
6. Sets the Refresh Token as an `HttpOnly` cookie.
7. Returns `201 Created` with the user data and Access Token.

### 2. `POST /api/auth/login`
**Purpose:** Authenticate an existing user.

**Flow:**
1. Request hits `validateRequest(loginSchema)`.
2. Controller fetches the user by `email`. If not found, returns `401 Unauthorized`.
3. Compares the provided password against the hashed database password using `bcrypt.compare()`.
4. If match fails, returns `401 Unauthorized`.
5. If match succeeds, generates new Access and Refresh tokens.
6. Sets the Refresh Token as an `HttpOnly` cookie.
7. Returns `200 OK` with the user data and Access Token.

### 3. `POST /api/auth/refresh`
**Purpose:** Get a new Access Token without logging in again.

**Flow:**
1. Controller reads the `refreshToken` from the incoming cookies.
2. If no token, returns `401 Unauthorized`.
3. Verifies the token cryptographically. If expired or invalid, returns `403 Forbidden`.
4. If valid, extracts the `userId` from the token and verifies the user still exists in the DB.
5. Generates a new Access Token.
6. Returns `200 OK` with the new Access Token.

### 4. `POST /api/auth/logout`
**Purpose:** End the user session.

**Flow:**
1. Controller clears the `refreshToken` cookie from the client's browser.
2. Returns `200 OK`.

---

## Validation (Zod)
We use a global Express middleware that intercepts requests before they hit the controller. If the body doesn't match the Zod schema, the middleware immediately rejects the request with a `400 Bad Request` and detailed error formatting, saving the controller from doing manual checks.
