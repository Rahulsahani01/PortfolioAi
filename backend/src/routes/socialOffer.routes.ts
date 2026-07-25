import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { createSocialOffer } from '../controllers/socialOffer.controller';

const router = Router();

// Protect all social offer routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/social-offers:
 *   post:
 *     summary: Submit a social media offer reference
 *     tags: [SocialOffers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - siteId
 *               - platform
 *               - handlerName
 *               - postUrl
 *               - screenshot
 *             properties:
 *               siteId:
 *                 type: string
 *                 format: uuid
 *               platform:
 *                 type: string
 *               handlerName:
 *                 type: string
 *               postUrl:
 *                 type: string
 *               screenshot:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Social offer reference submitted successfully
 *       400:
 *         description: Missing fields or screenshot
 */
router.post('/', uploadImage.single('screenshot'), createSocialOffer);

export default router;
