import { Router } from 'express';
import { upload, parseResume } from '../controllers/resume.controller';

const router = Router();

/**
 * @swagger
 * /api/resumes/parse:
 *   post:
 *     summary: Upload and parse a resume (Ephemeral Mock Mode)
 *     description: Uploads a PDF resume, parses text in-memory, and returns a mocked JSON structure for frontend form auto-fill testing. Does NOT save to database.
 *     tags: [Resumes]
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
router.post('/parse', upload.single('resume'), parseResume);

export default router;
