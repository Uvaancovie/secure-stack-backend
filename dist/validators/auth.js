"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string()
            .min(2, "Full name must be at least 2 characters")
            .max(120, "Full name must be less than 120 characters"),
        idNumber: zod_1.z.string()
            .regex(/^\d{13}$/, "ID number must be exactly 13 digits"),
        accountNumber: zod_1.z.string()
            .regex(/^\d{8,16}$/, "Account number must be 8-16 digits"),
        username: zod_1.z.string()
            .min(3, "Username must be at least 3 characters")
            .max(50, "Username must be less than 50 characters"),
        password: zod_1.z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    })
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, "Username is required"),
        password: zod_1.z.string().min(1, "Password is required")
    })
});
//# sourceMappingURL=auth.js.map