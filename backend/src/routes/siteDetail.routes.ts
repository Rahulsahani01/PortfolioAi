import { Router } from 'express';
import { upload, parseSiteDetail } from '../controllers/siteDetail.controller';

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

export default router;
