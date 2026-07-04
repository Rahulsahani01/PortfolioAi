import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Standard Redis connection for BullMQ
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
      delay: 5000, // Wait 5s before first retry, then 10s, then 20s
    },
    removeOnComplete: true,
  }
});
