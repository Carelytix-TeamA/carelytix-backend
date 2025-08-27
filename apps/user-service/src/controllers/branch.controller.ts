import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { ZodError } from "zod";
import { NotFoundError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";
import {
  createBranchSchema,
  deleteBranchSchema,
  updateBranchSchema,
} from "../utils/schema.js";

export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createBranchSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }
    const { name, address, city, pincode, contactNo, salon_id } = result;

    const data: any = {};
    data["name"] = name;
    data["saloonId"] = salon_id;
    if (address) data["address"] = address;
    if (city) data["city"] = city;
    if (pincode) data["pincode"] = pincode;
    if (contactNo) data["contactNo"] = contactNo;

    const existingSalon = await prisma.saloon.findFirst({
      where: { id: salon_id },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const newBranch = await prisma.branch.create({
      data: data,
    });

    return res
      .status(200)
      .json(new ApiResponse(201, newBranch, "Branch created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const salonId = req.params.id;
    const branches = await prisma.branch.findMany({
      where: { saloonId: salonId },
    });

    if (!branches) {
      return next(new NotFoundError("No branches found!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { branches }, "Branches fetched successfully!")
      );
  } catch (error) {
    return next(error);
  }
};

export const getSingleBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const salonId = req.params.id;
    const branchId = req.params.branch_id;

    const branch = await prisma.branch.findFirst({
      where: { id: branchId, saloonId: salonId },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }
    res.status(200).json(new ApiResponse(200, branch, "Branch fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const updateBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = req.params.id;

    const result = validateData(updateBranchSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }
    const { name, address, city, pincode, contactNo, salon_id } = result;

    const data = {};
    if (name) data["name"] = name;
    if (address) data["address"] = address;
    if (city) data["city"] = city;
    if (pincode) data["pincode"] = pincode;
    if (contactNo) data["contactNo"] = contactNo;

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId, saloonId: salon_id },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId, saloonId: salon_id },
      data: data,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedBranch, "Branch updated successfully!")
      );
  } catch (error) {
    return next(error);
  }
};

export const deleteBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = req.params.id;

    const result = validateData(deleteBranchSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }

    const { salon_id } = result;

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId, saloonId: salon_id },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    await prisma.branch.delete({
      where: { id: branchId, saloonId: salon_id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Branch deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
