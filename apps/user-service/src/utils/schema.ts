import { z } from "zod";

export const createSalonSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Salon name must be at least 2 characters long" })
    .max(50, { message: "Salon name must be at most 50 characters long" }),
});

export const updateSalonSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Salon name must be at least 2 characters long" })
    .max(50, { message: "Salon name must be at most 50 characters long" }),
});

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters long" })
    .max(50, { message: "Branch name must be at most 50 characters long" }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .max(200, { message: "Address must be at most 100 characters long" })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(50, {
      message: "City must be at most 50 characters long",
    })
    .optional(),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters long" })
    .max(6, { message: "Pincode must be at most 6 characters long" })
    .optional(),
  contactNo: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
  saloonId: z
    .string()
    .min(1, { message: "Salon ID is required" })
    .max(100, { message: "Salon ID must be at most 100 characters long" }),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters long" })
    .max(50, { message: "Branch name must be at most 50 characters long" }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .max(200, { message: "Address must be at most 100 characters long" })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(50, {
      message: "City must be at most 50 characters long",
    })
    .optional(),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters long" })
    .max(6, { message: "Pincode must be at most 6 characters long" })
    .optional(),
  contactNo: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
});

export const deleteBranchSchema = z.object({
  saloonId: z
    .string()
    .min(1, { message: "Salon ID is required" })
    .max(100, { message: "Salon ID must be at most 100 characters long" }),
});

export const createStaffSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Staff name must be at least 2 characters long" }),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .optional(),
  role: z.enum([
    "head_of_operation",
    "stylist",
    "manicurist",
    "make_up_artist",
    "floor_manager",
    "spa_staff",
    "cleaning_staff",
  ]),
  userId: z.string(),
  branchId: z.string(),
});

export const updateStaffSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .optional(),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 characters long" })
    .optional(),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" })
    .optional(),
  role: z
    .enum([
      "head_of_operation",
      "stylist",
      "manicurist",
      "make_up_artist",
      "floor_manager",
      "spa_staff",
      "cleaning_staff",
    ])
    .optional(),
});

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(200, { message: "Description must be at most 200 characters long" })
    .optional(),
  price: z.string().min(0, { message: "Price must be at least 0" }),
  durationMinutes: z
    .string()
    .min(0, { message: "Duration must be at least 0" })
    .optional(),
  branchId: z.string(),
});
