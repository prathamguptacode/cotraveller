import { z } from "zod";

export const AuthFormSchema = z.object({
    email: z
        .email({ message: "Email is invalid or already taken" })
        .toLowerCase()
        .trim(),
    password: z.string()
        .trim()
        .min(8, { message: "Password is too short" })
        .max(64, { message: "Password is too long" })
        .regex(/[A-Z]/, { message: "Password needs an uppercase letter" })
        .regex(/[a-z]/, { message: "Password needs a lowercase letter" })
        .regex(/[0-9]/, { message: "Password needs a number" })
        .regex(/[^A-Za-z0-9\s]/, { message: "Password needs a special character" }),
})

