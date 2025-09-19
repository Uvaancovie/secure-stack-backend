"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSchema = exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive().max(10000000),
        currency: zod_1.z.string().regex(/^[A-Z]{3}$/),
        provider: zod_1.z.literal("SWIFT").optional(),
        payeeAccount: zod_1.z.string().regex(/^\d{8,20}$/),
        swiftCode: zod_1.z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/),
    })
});
exports.createPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().max(10000000),
    currency: zod_1.z.string().regex(/^[A-Z]{3}$/),
    provider: zod_1.z.literal("SWIFT").optional(),
    payeeAccount: zod_1.z.string().regex(/^\d{8,20}$/),
    swiftCode: zod_1.z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/),
});
//# sourceMappingURL=payment.js.map