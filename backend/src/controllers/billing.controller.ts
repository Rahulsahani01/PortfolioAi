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

    if (!req.file) {
      return res.status(400).json({ error: { message: 'Screenshot is required' } });
    }

    // In a real app, upload req.file.buffer to S3/Cloudinary and get URL
    // For mock purposes, we'll generate a fake URL
    const screenshotUrl = `https://mock-storage.com/${req.file.originalname}`;

    // Check if the UTR number is already used by another payment
    const existingUtr = await prisma.payment.findUnique({ where: { providerId: utrNumber } });
    if (existingUtr && existingUtr.id !== paymentId) {
      return res.status(400).json({ error: { message: 'This UTR number has already been submitted for another payment.' } });
    }

    // Save the UTR number and screenshot URL for admin review
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { 
        providerId: utrNumber, 
        screenshotUrl 
      },
    });

    // Mark the site as UNDER_REVIEW
    await prisma.site.update({
      where: { id: payment.siteId },
      data: { status: 'UNDER_REVIEW' },
    });

    res.status(200).json({
      message: 'Payment details submitted successfully. Site is now under review.',
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
