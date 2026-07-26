import { z } from 'zod';

export const createSiteSchema = z.object({
  body: z.object({
    templateKey: z.string().optional(),
    slug: z.string({
      required_error: 'Slug is required',
    })
    .min(3, 'Slug must be at least 3 characters long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    siteDetailId: z.string().uuid('Invalid Site Detail ID format').optional(),
  }),
});

export const updateSiteSchema = z.object({
  body: z.object({
    customData: z.record(z.any()).optional(),
    templateKey: z.string().optional(),
  }),
});
