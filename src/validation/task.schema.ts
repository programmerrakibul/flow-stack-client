import { z } from "zod/v4";
import { Priority } from "@/types/task";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>;
