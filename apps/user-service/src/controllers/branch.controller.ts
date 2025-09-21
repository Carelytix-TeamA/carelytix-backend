import { NextFunction, Request, Response } from "express";
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
    console.log("result", req.body);
    const result = createBranchSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }
    const { name, address, city, pincode, contactNo, saloonId, branchCode } =
      result.data;
    const existingSalon = await prisma.saloon.findFirst({
      where: { id: saloonId },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        city,
        pincode,
        contactNo,
        saloonId,
        branchCode,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          { branch: newBranch },
          "Branch created successfully!"
        )
      );
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
    const userId = req.user?.id;

    const salon = await prisma.saloon.findFirst({
      where: { ownerId: userId },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }
    const branches = await prisma.branch.findMany({
      where: { saloonId: salon.id },
    });

    if (!branches || branches.length === 0) {
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
    const branchId = req.params.id;

    const branch = await prisma.branch.findFirst({
      where: { id: branchId },
    });

    if (!branch) {
      return next(new NotFoundError("Branch not found!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, branch, "Branch fetched successfully!"));
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
    const result = updateBranchSchema.safeParse(req.body);

    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, address, city, pincode, contactNo, branchCode } = result.data;

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        name,
        address,
        city,
        pincode,
        contactNo,
        branchCode,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { branch: updatedBranch },
          "Branch updated successfully!"
        )
      );
  } catch (error) {
    console.log(error);
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
    console.log("branchId", branchId);
    if (!branchId) {
      throw new ValidationError("Invalid request data");
    }

    const existingBranch = await prisma.branch.findFirst({
      where: { id: branchId },
    });

    if (!existingBranch) {
      return next(new NotFoundError("Branch not found!"));
    }

    await prisma.branch.delete({
      where: { id: branchId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Branch deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
