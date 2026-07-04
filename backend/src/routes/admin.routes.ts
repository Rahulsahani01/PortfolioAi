import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { getPendingPayments, approvePayment } from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes: User must be logged in AND be the Admin
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/payments/pending:
 *   get:
 *     summary: (ADMIN) Get all pending UPI payments with UTRs submitted
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending payments
 */
router.get('/payments/pending', getPendingPayments);

/**
 * @swagger
 * /api/admin/payments/{id}/approve:
 *   post:
 *     summary: (ADMIN) Approve a pending payment and activate the user's subscription
 *     tags: [Admin]
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
 *         description: Payment approved and Subscription activated
 */
router.post('/payments/:id/approve', approvePayment);

export default router;
