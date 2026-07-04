# Technical Debt / Issue Tracker

## Issue: Redis/BullMQ Disabled Locally
**Status:** ⚠️ TEMPORARY WORKAROUND APPLIED
**Date:** July 4, 2026

### The Problem
The local development environment's Docker daemon is broken or inaccessible (Error: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock.`). 
Because of this, we could not spin up a local Redis container. The Node.js server (`ts-node-dev`) was aggressively crashing on boot with `ECONNREFUSED 127.0.0.1:6379` because BullMQ was trying to connect to a non-existent Redis instance.

### The Temporary Fix (Applied)
To unblock frontend development and API testing, Redis has been completely mocked out of the backend:

1. **Worker Disabled:** 
   In `src/server.ts`, the background worker import was commented out:
   `// import './workers/publish.worker';`
2. **Queue Mocked:** 
   In `src/queues/publish.queue.ts`, the actual BullMQ `Queue` and `IORedis` connection were deleted and replaced with a dummy Javascript object that just `console.log`s when a job is added.

---

## Action Required (Before Production Deployment)

When you deploy this application to a real VPS (where a Redis container is successfully running), you **MUST** revert these two files, otherwise background publishing to GitHub will not work!

### Step 1: Uncomment the Worker
Open `src/server.ts` and change line 18 back to:
```typescript
import './workers/publish.worker';
```

### Step 2: Restore the Real Queue
Open `src/queues/publish.queue.ts` and replace the mock code with the real BullMQ implementation:
```typescript
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// In production, configure REDIS_URL in .env (e.g. redis://default:password@localhost:6379)
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Create the Queue
export const publishQueue = new Queue('site-publish-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, 
    },
    removeOnComplete: true,
  }
});
```

*Note: You can leave these files mocked indefinitely while you build your frontend locally.*
