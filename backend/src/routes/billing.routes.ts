import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import { checkoutSchema, verifyPaymentSchema } from '../schemas/billing.schema';
import { createCheckout, verifyPayment, getBillingStatus } from '../controllers/billing.controller';

const router = Router();

// Protect all billing routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/billing/checkout:
 *   post:
 *     summary: Generate a manual UPI checkout intent
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Checkout intent created with UPI details
 */
router.post('/checkout', validateRequest(checkoutSchema), createCheckout);

/**
 * @swagger
 * /api/billing/verify:
 *   post:
 *     summary: Submit a UTR number for admin verification
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - utrNumber
 *             properties:
 *               paymentId:
 *                 type: string
 *                 format: uuid
 *               utrNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: UTR submitted successfully
 */
router.post('/verify', validateRequest(verifyPaymentSchema), verifyPayment);

/**
 * @swagger
 * /api/billing/status/{siteId}:
 *   get:
 *     summary: Get subscription and pending payment status for a specific site
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns subscription and review status
 */
router.get('/status/:siteId', getBillingStatus);

export default router;
