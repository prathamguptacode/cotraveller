import { z } from "zod";

export const AuthFormSchema = z.object({
    email: z
        // Use the built-in RFC 5322 compliant regex for 2026 standards
        .email({ message: "Please enter a valid email address" })
        // Optional: Add manual domain restriction if needed
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password cannot exceed 20 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9\s]/, { message: "Password must contain at least one special character" }).trim(),
})

