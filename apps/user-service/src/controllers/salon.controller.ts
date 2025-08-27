import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { createSalonSchema, updateSalonSchema } from "../utils/schema";
import { ZodError } from "zod";
import { ValidationError, NotFoundError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id as string;

    const result = validateData(createSalonSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }

    const { name } = req.body;
    const existingSalon = await prisma.saloon.findFirst({
      where: { name, ownerId: ownerId },
    });

    if (existingSalon) {
      return next(new NotFoundError("Salon already exists with this name!"));
    }

    const salon = await prisma.saloon.create({
      data: { name: name, ownerId: ownerId },
    });

    res
      .status(200)
      .json(new ApiResponse(200, salon, "Salon created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllSalons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id as string;
    const salons = await prisma.saloon.findMany({
      where: { ownerId: ownerId },
    });

    if (!salons) {
      return next(new NotFoundError("No salons found!"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, { salons }, "Salons fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getSingleSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id as string;
    const salonId = req.params.id;

    const salon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }
    res.status(200).json(new ApiResponse(200, salon, "Salon fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const updateSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id as string;
    const salonId = req.params.id;

    const result = validateData(updateSalonSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }

    const { name } = result;

    const existingSalon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const updatedSalon = await prisma.saloon.update({
      where: { id: salonId, ownerId: ownerId },
      data: { name: name },
    });
    res
      .status(200)
      .json(new ApiResponse(200, updatedSalon, "Salon updated successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id as string;
    const salonId = req.params.id;

    const salon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }

    await prisma.saloon.delete({
      where: { id: salonId, ownerId: ownerId },
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Salon deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
