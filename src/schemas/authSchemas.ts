import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(1, "Password is not valid"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("email is required"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
