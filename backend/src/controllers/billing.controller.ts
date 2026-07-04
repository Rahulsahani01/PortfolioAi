import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { amount, siteId } = req.body;

    // Verify site belongs to user
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.userId !== userId) {
      return res.status(404).json({ error: { message: 'Site not found or unauthorized' } });
    }

    // Create a PENDING payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        siteId,
        amount,
        status: 'PENDING',
        provider: 'MANUAL_UPI',
      },
    });

    res.status(201).json({
      message: 'Checkout intent created successfully',
      paymentId: payment.id,
      amount: payment.amount,
      upiId: 'rahul@okhdfcbank', // Change this to your actual UPI ID
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { paymentId, utrNumber } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

    if (!payment || payment.userId !== userId) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    if (payment.status !== 'PENDING') {
      return res.status(400).json({ error: { message: `Payment is already ${payment.status}` } });
    }

    // Save the UTR number for admin review
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { providerId: utrNumber }, // Storing UTR in providerId
    });

    res.status(200).json({
      message: 'UTR submitted successfully. Awaiting admin approval.',
      payment: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

export const getBillingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { siteId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { siteId },
    });

    // Also fetch the most recent pending payment for THIS site to show status on the frontend
    const pendingPayment = await prisma.payment.findFirst({
      where: { userId, siteId, status: 'PENDING', providerId: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      subscription: subscription || { status: 'INACTIVE' },
      pendingReview: !!pendingPayment,
    });
  } catch (error) {
    next(error);
  }
};
