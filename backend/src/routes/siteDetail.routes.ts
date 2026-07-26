import { Router } from 'express';
import { upload, parseSiteDetail, saveSiteDetail } from '../controllers/siteDetail.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/site-details/parse:
 *   post:
 *     summary: Upload and parse a site detail file (Ephemeral Mock Mode)
 *     description: Uploads a PDF, parses text in-memory, and returns a mocked JSON structure. Does NOT save to database.
 *     tags: [SiteDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The PDF resume file (Max 10MB)
 *     responses:
 *       200:
 *         description: Successfully parsed and returned JSON
 *       400:
 *         description: Bad request (no file or unsupported type)
 */
router.post('/parse', upload.single('resume'), parseSiteDetail);

/**
 * @swagger
 * /api/site-details/save:
 *   post:
 *     summary: Save manual site details
 *     tags: [SiteDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteDetailId:
 *                 type: string
 *               customData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Saved successfully
 */
router.post('/save', authenticateToken, saveSiteDetail);

export default router;
