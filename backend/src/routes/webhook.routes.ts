import { Router } from 'express';
import { handleGithubWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * @swagger
 * /api/webhooks/github-success:
 *   post:
 *     summary: Webhook receiver for GitHub Actions successful deployment
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - siteId
 *             properties:
 *               siteId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Database updated successfully
 */
router.post('/github-success', handleGithubWebhook);

export default router;
