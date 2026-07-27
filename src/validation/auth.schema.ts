import { z } from "zod/v4";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),

    email: z.email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),

    image: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
