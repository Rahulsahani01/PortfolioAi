import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.warn('[Admin Middleware] ADMIN_EMAIL is not set in .env!');
      return res.status(500).json({ error: { message: 'Server configuration error.' } });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.email !== adminEmail) {
      return res.status(403).json({ error: { message: 'Forbidden. Admin access required.' } });
    }

    next();
  } catch (error) {
    next(error);
  }
};
