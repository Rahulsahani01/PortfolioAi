# Running the Server Locally (Development)

This guide is for the developer (Rahul) to quickly boot the backend on their local machine for testing and building the frontend.

## 1. Prerequisites
Ensure you have the following installed:
* Node.js (v18+)
* PostgreSQL (Running locally)

## 2. Environment Setup
Make sure your `.env` file exists in the `/backend` folder.
*You do NOT need a `REDIS_URL` locally right now because we have mocked it.*

## 3. Database Sync
If you have made changes to the `prisma/schema.prisma` file, sync them:
```bash
npx prisma db push
# or
npx prisma migrate dev
```

## 4. Booting the Server
Start the development server with auto-reloading:
```bash
npm run dev
```

### ⚠️ IMPORTANT NOTE REGARDING REDIS & PUBLISHING ⚠️
Because your local Docker installation is broken, **Redis and BullMQ have been disabled locally**. 
* In `src/server.ts`, the background worker is commented out.
* In `src/queues/publish.queue.ts`, the queue is replaced with a mock object.

**What does this mean for local testing?**
When you test the "Publish" button on your frontend, the API will return a success message, but it will **NOT** actually push code to GitHub. It will just print `[MOCK QUEUE] Simulating adding job` in your terminal. This is intentional so you can build the frontend without crashes.
