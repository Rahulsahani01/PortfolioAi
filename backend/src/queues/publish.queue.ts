// --- MOCK QUEUE FOR LOCAL DEVELOPMENT WITHOUT DOCKER ---
// Since Docker is broken on your local machine, this mock object prevents the app from crashing.
// When you deploy to production, you will replace this file with the real BullMQ Queue code.

export const publishQueue = {
  add: async (name: string, data: any) => {
    console.log(`\n[MOCK QUEUE] Simulating adding job to queue... (Redis is disabled locally)`);
    console.log(`[MOCK QUEUE] Job Data:`, data);
    return { id: 'mock-job-id' };
  }
} as any;
