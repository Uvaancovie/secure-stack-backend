import { z } from "zod";
export declare const paymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
        provider: z.ZodOptional<z.ZodLiteral<"SWIFT">>;
        payeeAccount: z.ZodString;
        swiftCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: string;
        payeeAccount: string;
        swiftCode: string;
        provider?: "SWIFT" | undefined;
    }, {
        amount: number;
        currency: string;
        payeeAccount: string;
        swiftCode: string;
        provider?: "SWIFT" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        currency: string;
        payeeAccount: string;
        swiftCode: string;
        provider?: "SWIFT" | undefined;
    };
}, {
    body: {
        amount: number;
        currency: string;
        payeeAccount: string;
        swiftCode: string;
        provider?: "SWIFT" | undefined;
    };
}>;
export declare const createPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
    provider: z.ZodOptional<z.ZodLiteral<"SWIFT">>;
    payeeAccount: z.ZodString;
    swiftCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: string;
    payeeAccount: string;
    swiftCode: string;
    provider?: "SWIFT" | undefined;
}, {
    amount: number;
    currency: string;
    payeeAccount: string;
    swiftCode: string;
    provider?: "SWIFT" | undefined;
}>;
export type PaymentRequest = z.infer<typeof paymentSchema>;
//# sourceMappingURL=payment.d.ts.map