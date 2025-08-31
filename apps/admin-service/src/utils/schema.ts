import { z } from "zod";

export const createMemberSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  email_id: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const updateMemberSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .optional(),
  email_id: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .optional(),
});

export const createFeatureSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const updateFeatureSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const createModuleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const updateModuleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const addFeatureToModuleSchema = z.object({
  feature_ids: z.array(z.string()),
});

export const removeFeatureFromModuleSchema = z.object({
  feature_ids: z.array(z.string()),
});

export const createPlanSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  module_ids: z.array(z.string()),
});

export const updatePlanSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  planMeta: z.record(z.any(), z.any()).optional(),
});

export const addModuleToPlanSchema = z.object({
  module_ids: z.array(z.string()),
});

export const removeModuleFromPlanSchema = z.object({
  module_ids: z.array(z.string()),
});
