import { z } from "zod";

export const paymentSchema = z.object({
  body: z.object({
    amount: z.number().positive().max(10000000),
    currency: z.string().regex(/^[A-Z]{3}$/),
    provider: z.literal("SWIFT").optional(),
    payeeAccount: z.string().regex(/^\d{8,20}$/),
    swiftCode: z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/),
    recipient: z.object({
      name: z.string().min(1).max(100),
      bank: z.string().min(1).max(100)
    })
  })
});

export const createPaymentSchema = z.object({
  amount:       z.number().positive().max(10000000),
  currency:     z.string().regex(/^[A-Z]{3}$/),
  provider:     z.literal("SWIFT").optional(),
  payeeAccount: z.string().regex(/^\d{8,20}$/),
  swiftCode:    z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/),
  recipient: z.object({
    name: z.string().min(1).max(100),
    bank: z.string().min(1).max(100)
  })
});

export type PaymentRequest = z.infer<typeof paymentSchema>;