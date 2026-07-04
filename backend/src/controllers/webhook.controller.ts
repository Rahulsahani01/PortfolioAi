import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const handleGithubWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: In production, verify the GitHub webhook signature using a secret!
    
    // We expect the GitHub Action to send a payload like: { "siteId": "uuid-here" }
    const { siteId } = req.body;

    if (!siteId) {
      return res.status(400).json({ error: { message: 'siteId is required in webhook payload' } });
    }

    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) {
      return res.status(404).json({ error: { message: 'Site not found' } });
    }

    // Generate the public URL (e.g., https://rahul.portfolio.ai or whatever host you use)
    // For now we assume a hardcoded base domain for the prototype
    const publishedUrl = `https://${site.slug}.yourdomain.com`;

    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        status: 'LIVE',
        publishedUrl,
      },
    });

    console.log(`[Webhook] Site ${siteId} successfully marked as LIVE at ${publishedUrl}`);
    res.status(200).json({ message: 'Webhook received, site is LIVE', site: updatedSite });
  } catch (error) {
    next(error);
  }
};
