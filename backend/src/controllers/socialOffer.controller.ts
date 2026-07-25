import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const createSocialOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { siteId, platform, handlerName, postUrl } = req.body;

    if (!siteId || !platform || !handlerName || !postUrl) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    if (!req.file) {
      return res.status(400).json({ error: { message: 'Screenshot is required' } });
    }

    // Verify site belongs to user
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.userId !== userId) {
      return res.status(404).json({ error: { message: 'Site not found or unauthorized' } });
    }

    // Check if offer already exists for this site
    const existingOffer = await prisma.socialOffer.findUnique({ where: { siteId } });
    if (existingOffer) {
      return res.status(400).json({ error: { message: 'An offer has already been submitted for this site' } });
    }

    // Generate mock URL for screenshot
    const screenshotUrl = `https://mock-storage.com/offers/${req.file.originalname}`;

    // Create SocialOffer record
    const socialOffer = await prisma.socialOffer.create({
      data: {
        siteId,
        platform,
        handlerName,
        postUrl,
        screenshotUrl,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Social offer reference submitted successfully',
      socialOffer,
    });
  } catch (error) {
    next(error);
  }
};
