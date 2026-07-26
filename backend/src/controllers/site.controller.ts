import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { publishQueue } from '../queues/publish.queue';

export const getSites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { siteId } = req.query;
    
    const whereClause: any = { userId };
    if (siteId && typeof siteId === 'string') {
      whereClause.id = siteId;
    }

    const sitesData = await prisma.site.findMany({ 
      where: whereClause,
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        socialOffer: true
      }
    });
    
    const sites = sitesData.map((site: any) => ({
      ...site,
      paymentStatus: site.payments.length > 0 ? site.payments[0].status : null
    }));
    
    res.status(200).json({ sites });
  } catch (error) {
    next(error);
  }
};

export const checkSlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: { message: 'Slug query parameter is required' } });
    }

    const existingSite = await prisma.site.findUnique({ where: { slug } });
    if (existingSite) {
      return res.status(200).json({ available: false, message: 'Slug is already taken' });
    }

    res.status(200).json({ available: true, message: 'Slug is available' });
  } catch (error) {
    next(error);
  }
};

export const createSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { templateKey, slug, siteDetailId } = req.body;

    // Verify slug uniqueness again before creating
    const existingSite = await prisma.site.findUnique({ where: { slug } });
    if (existingSite) {
      return res.status(400).json({ error: { message: 'Slug is already taken' } });
    }

    let finalSiteDetailId = siteDetailId;
    if (!finalSiteDetailId) {
      const newDetail = await prisma.siteDetail.create({
        data: {
          userId,
          fileUrl: 'manual',
          status: 'PENDING',
          parsedData: {}
        }
      });
      finalSiteDetailId = newDetail.id;
    }

    const site = await prisma.site.create({
      data: {
        userId,
        siteDetailId: finalSiteDetailId,
        templateKey: templateKey || 'modern-dev',
        slug,
        status: 'DRAFT',
      },
    });

    res.status(201).json({ message: 'Site draft created', site });
  } catch (error) {
    next(error);
  }
};

export const updateSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { customData, templateKey } = req.body;

    // Verify ownership
    const site = await prisma.site.findUnique({ where: { id } });
    if (!site || site.userId !== userId) {
      return res.status(404).json({ error: { message: 'Site not found or unauthorized' } });
    }

    const updatedSite = await prisma.site.update({
      where: { id },
      data: {
        customData: customData || site.customData,
        templateKey: templateKey || site.templateKey,
      },
    });

    res.status(200).json({ message: 'Site updated successfully', site: updatedSite });
  } catch (error) {
    next(error);
  }
};

export const publishSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // 1. Check Subscription (The Bouncer - Per Site)
    const subscription = await prisma.subscription.findUnique({
      where: { siteId: id },
    });
    const isActive = subscription && subscription.status === 'ACTIVE' && subscription.endDate > new Date();

    if (!isActive) {
      return res.status(402).json({ 
        error: { 
          message: 'Payment Required', 
          code: 'SUBSCRIPTION_REQUIRED' 
        } 
      });
    }

    // 2. Verify ownership and get site data
    const site = await prisma.site.findUnique({ where: { id } });
    if (!site || site.userId !== userId) {
      return res.status(404).json({ error: { message: 'Site not found or unauthorized' } });
    }

    // 2. Ensure it has custom data to publish
    if (!site.customData) {
      return res.status(400).json({ error: { message: 'Cannot publish site without site detail data (customData).' } });
    }

    // 3. Update status to PUBLISHING
    await prisma.site.update({
      where: { id },
      data: { status: 'PUBLISHING' },
    });

    // 4. Drop the job into BullMQ queue
    await publishQueue.add('github-publish', {
      siteId: site.id,
      slug: site.slug,
      templateKey: site.templateKey,
      siteDetailData: site.customData,
    });

    // 5. Instantly respond to frontend
    res.status(202).json({ 
      message: 'Publishing started in the background.', 
      status: 'PUBLISHING' 
    });
  } catch (error) {
    next(error);
  }
};
