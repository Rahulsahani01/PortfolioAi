import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { Octokit } from 'octokit';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Initialize Octokit with the Personal Access Token from .env
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPO_OWNER || '';
const repo = process.env.GITHUB_REPO_NAME || '';

export const publishWorker = new Worker('site-publish-queue', async (job: Job) => {
  const { siteId, slug, templateKey, resumeData } = job.data;
  const branchName = `feature/site-${siteId}`;

  try {
    console.log(`[Worker] Starting publish job for Site ID: ${siteId}`);

    // 1. Get the latest commit SHA from the main branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: 'heads/main',
    });
    const baseSha = refData.object.sha;

    // 2. Create a new branch for this specific user's site
    try {
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
      });
      console.log(`[Worker] Created branch: ${branchName}`);
    } catch (error: any) {
      // If branch exists, we ignore the error (they might be re-publishing)
      if (error.status !== 422) throw error;
      console.log(`[Worker] Branch ${branchName} already exists, proceeding...`);
    }

    // 3. Create a Blob for the JSON data file
    const contentToCommit = JSON.stringify({ templateKey, resumeData }, null, 2);
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: contentToCommit,
      encoding: 'utf-8',
    });

    // 4. Create a Tree containing the new file
    // We place the data inside a 'data' folder
    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseSha,
      tree: [
        {
          path: `data/${slug}.json`,
          mode: '100644', // File mode
          type: 'blob',
          sha: blobData.sha,
        },
      ],
    });

    // 5. Create a Commit
    const { data: commitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Deploy: Update site for ${slug}`,
      tree: treeData.sha,
      parents: [baseSha],
    });

    // 6. Update the branch reference to point to the new commit (this triggers GitHub Actions!)
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: commitData.sha,
      force: true,
    });

    console.log(`[Worker] Successfully pushed JSON data to branch ${branchName}`);
    return { success: true, commitSha: commitData.sha };

  } catch (error) {
    console.error(`[Worker] Failed to publish site ID: ${siteId}`, error);
    throw error; // Throwing triggers BullMQ's automatic retry logic
  }
}, { connection });

// Handle worker events for debugging
publishWorker.on('completed', (job) => {
  console.log(`[BullMQ] Job ${job.id} has completed successfully!`);
});
publishWorker.on('failed', (job, err) => {
  console.error(`[BullMQ] Job ${job?.id} has failed with error: ${err.message}`);
});
