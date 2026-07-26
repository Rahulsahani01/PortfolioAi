import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import { createSiteSchema, updateSiteSchema } from '../schemas/site.schema';
import { getSites, checkSlug, createSite, updateSite, publishSite, deleteSite } from '../controllers/site.controller';

const router = Router();

/**
 * @swagger
 * /api/sites/check-slug:
 *   get:
 *     summary: Check if a URL slug is available
 *     tags: [Sites]
 *     parameters:
 *       - in: query
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns availability status
 */
router.get('/check-slug', checkSlug);

// All routes below this line require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/sites:
 *   get:
 *     summary: Get all sites for logged-in user
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of sites
 */
router.get('/', getSites);

/**
 * @swagger
 * /api/sites:
 *   post:
 *     summary: Create a new site draft
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateKey
 *               - slug
 *               - siteDetailId
 *             properties:
 *               templateKey:
 *                 type: string
 *               slug:
 *                 type: string
 *               siteDetailId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Draft created
 */
router.post('/', validateRequest(createSiteSchema), createSite);

/**
 * @swagger
 * /api/sites/{id}:
 *   put:
 *     summary: Update a site's data
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customData:
 *                 type: object
 *               templateKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Site updated
 */
router.put('/:id', validateRequest(updateSiteSchema), updateSite);

/**
 * @swagger
 * /api/sites/{id}/publish:
 *   post:
 *     summary: Trigger background publishing to GitHub
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Publishing started
 */
router.post('/:id/publish', publishSite);

/**
 * @swagger
 * /api/sites/{id}:
 *   delete:
 *     summary: Delete a site
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site deleted successfully
 */
router.delete('/:id', deleteSite);

export default router;
