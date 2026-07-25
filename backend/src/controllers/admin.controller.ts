import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const getPendingPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all payments that have a UTR submitted (providerId is not null) but are still PENDING
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        providerId: { not: null },
      },
      include: {
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ pendingPayments });
  } catch (error) {
    next(error);
  }
};

export const approvePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }
    if (payment.status === 'COMPLETED') {
      return res.status(400).json({ error: { message: 'Payment is already completed' } });
    }

    // Wrap in a transaction to ensure everything updates together
    await prisma.$transaction(async (tx) => {
      // 1. Upsert subscription (create or update to ACTIVE for 1 year for this specific site)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const subscription = await tx.subscription.upsert({
        where: { siteId: payment.siteId },
        create: {
          userId: payment.userId,
          siteId: payment.siteId,
          paymentId: payment.id,
          planType: 'pro',
          status: 'ACTIVE',
          endDate: oneYearFromNow,
        },
        update: {
          paymentId: payment.id,
          planType: 'pro',
          status: 'ACTIVE',
          endDate: oneYearFromNow, 
        },
      });

      // 2. Mark payment as completed and link to subscription
      await tx.payment.update({
        where: { id },
        data: { 
          status: 'COMPLETED',
          subscriptionId: subscription.id
        },
      });

      // 3. Update the Site to link the subscription
      await tx.site.update({
        where: { id: payment.siteId },
        data: { subscriptionId: subscription.id }
      });
    });

    res.status(200).json({ message: 'Payment approved and Subscription activated successfully!' });
  } catch (error) {
    next(error);
  }
};
