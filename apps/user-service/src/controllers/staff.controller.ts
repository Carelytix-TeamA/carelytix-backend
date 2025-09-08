import { NextFunction, Request, Response } from "express";
import { createStaffSchema } from "../utils/schema.js";
import { NotFoundError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";

export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = createStaffSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, role, userId, branchId } = result.data;

    const staff = await prisma.staff.create({
      data: {
        role,
        branchId,
        userId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, staff, "Staff created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staff = await prisma.staff.findMany();

    if (!staff) {
      return next(new NotFoundError("No staff found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, staff, "All Staffs fetched successfully!"));
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staffId = req.params.id;
    if (!staffId) {
      return next(new NotFoundError("No staff Id found!"));
    }

    const staff = await prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      return next(new NotFoundError("No staff found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, staff, "Staff fetched successfully!"));
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staffId = req.params.id;
    if (!staffId) {
      return next(new NotFoundError("No staff Id found!"));
    }

    const staff = await prisma.staff.delete({ where: { id: staffId } });
    if (!staff) {
      return next(new NotFoundError("No staff found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, staff, "Staff deleted successfully!"));
  } catch (error) {
    next(error);
  }
};
