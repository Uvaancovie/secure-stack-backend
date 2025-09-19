import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        fullName: z.ZodString;
        idNumber: z.ZodString;
        accountNumber: z.ZodString;
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fullName: string;
        idNumber: string;
        accountNumber: string;
        username: string;
        password: string;
    }, {
        fullName: string;
        idNumber: string;
        accountNumber: string;
        username: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fullName: string;
        idNumber: string;
        accountNumber: string;
        username: string;
        password: string;
    };
}, {
    body: {
        fullName: string;
        idNumber: string;
        accountNumber: string;
        username: string;
        password: string;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        username: string;
        password: string;
    }, {
        username: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        username: string;
        password: string;
    };
}, {
    body: {
        username: string;
        password: string;
    };
}>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
//# sourceMappingURL=auth.d.ts.map