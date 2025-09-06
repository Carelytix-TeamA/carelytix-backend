import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";
import z from "zod";

const createSalonSchema = z.object({
  name: z.string(),
});

const updateSalonSchema = createSalonSchema.partial();

export const createSalon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    console.log("ownerId", ownerId);
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const result = createSalonSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name } = result.data;
    const existingSalon = await prisma.saloon.findFirst({
      where: { name, ownerId: ownerId },
    });

    if (existingSalon) {
      return next(new NotFoundError("Salon already exists with this name!"));
    }

    const salon = await prisma.saloon.create({
      data: { name: name, ownerId: ownerId },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, salon, "Salon created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllSalons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }
    const salons = await prisma.saloon.findMany({
      where: { ownerId: ownerId },
    });

    if (!salons || salons.length === 0) {
      return next(new NotFoundError("No salons found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { salons }, "Salons fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const getSingleSalon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }
    const salonId = req.params.id;

    const salon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!salon) {
      return next(new NotFoundError("Salon not found!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, salon, "Salon fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const updateSalon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }
    const salonId = req.params.id;

    const result = updateSalonSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name } = result.data;

    const existingSalon = await prisma.saloon.findFirst({
      where: { id: salonId, ownerId: ownerId },
    });

    if (!existingSalon) {
      return next(new NotFoundError("Salon not found!"));
    }

    const updatedSalon = await prisma.saloon.update({
      where: { id: salonId, ownerId: ownerId },
      data: { name },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, updatedSalon, "Salon updated successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteSalon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }
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

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Salon deleted successfully!"));
  } catch (error) {
    return next(error);
  }
};
