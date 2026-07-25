import { z } from 'zod';

export const createSiteSchema = z.object({
  body: z.object({
    templateKey: z.string({
      required_error: 'Template Key is required',
    }),
    slug: z.string({
      required_error: 'Slug is required',
    })
    .min(3, 'Slug must be at least 3 characters long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    siteDetailId: z.string({
      required_error: 'Site Detail ID is required to link the parsed data',
    }).uuid('Invalid Site Detail ID format'),
  }),
});

export const updateSiteSchema = z.object({
  body: z.object({
    customData: z.record(z.any(), {
      required_error: 'Custom JSON data is required for updates',
    }),
    templateKey: z.string().optional(),
  }),
});
