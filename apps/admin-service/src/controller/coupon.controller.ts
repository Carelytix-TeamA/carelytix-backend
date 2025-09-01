import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { ZodError } from "zod";
import { AuthError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";
import { createCouponSchema } from "../utils/schema";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createCouponSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { coupon_code, discount_type, amount, coupon_type } = result;
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
