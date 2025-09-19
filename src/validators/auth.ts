import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be less than 120 characters"),
    idNumber: z.string()
      .regex(/^\d{13}$/, "ID number must be exactly 13 digits"),
    accountNumber: z.string()
      .regex(/^\d{8,16}$/, "Account number must be 8-16 digits"),
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
  })
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
  })
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
