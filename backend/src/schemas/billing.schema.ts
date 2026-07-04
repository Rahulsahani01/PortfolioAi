import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    siteId: z.string({
      required_error: 'Site ID is required',
    }).uuid('Invalid Site ID'),
    amount: z.number({
      required_error: 'Amount is required',
    }).positive('Amount must be greater than 0'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string({
      required_error: 'Payment ID is required',
    }).uuid('Invalid Payment ID'),
    utrNumber: z.string({
      required_error: 'UTR Number is required',
    })
    .min(12, 'UTR Number must be exactly 12 digits')
    .max(12, 'UTR Number must be exactly 12 digits')
    .regex(/^\d+$/, 'UTR Number must contain only numbers'),
  }),
});
