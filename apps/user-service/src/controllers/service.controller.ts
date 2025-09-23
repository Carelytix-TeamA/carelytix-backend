import { prisma } from "@carelytix/db";
import { NotFoundError, ValidationError } from "@carelytix/utils/error-handler";
import { ApiResponse } from "@carelytix/utils/responce";
import { NextFunction, Request, Response } from "express";
import { createServiceSchema, updateServiceSchema } from "src/utils/schema.js";

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const result = createServiceSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, price, description, durationMinutes, branchId } = result.data;

    const data: {
      name: string;
      price: number;
      branchId: string;
      description?: string;
      durationMinutes?: number;
    } = {
      name: name,
      price: Number(price),
      branchId,
    };

    if (description) data.description = description;
    if (durationMinutes) data.durationMinutes = Number(durationMinutes);

    const service = await prisma.service.create({
      data: data,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, service, "Service created"));
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await prisma.service.findMany();
    return res
      .status(200)
      .json(new ApiResponse(200, services, "Services fetched"));
  } catch (error) {
    next(error);
  }
};

export const getSingleService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId) {
      return next(new NotFoundError("Service Id Required!"));
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId },
    });

    if (!service) {
      return next(new NotFoundError("Service not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Service fetched successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const serviceId = req.params.id;
    if (!serviceId) {
      return next(new NotFoundError("Service not found!"));
    }

    const result = updateServiceSchema.safeParse(req.body);
    if (result.error) {
      throw new ValidationError(result.error.message || "Invalid request data");
    }

    const { name, price, description, durationMinutes, branchId } = result.data;

    const data: {
      name?: string;
      price?: number;
      branchId?: string;
      description?: string;
      durationMinutes?: number;
    } = {};

    if (name) data.name = name;
    if (price) data.price = Number(price);
    if (branchId) data.branchId = branchId;
    if (description) data.description = description;
    if (durationMinutes) data.durationMinutes = Number(durationMinutes);

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: data,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Service updated successfully!"));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new ValidationError("User not authenticated");
    }

    const serviceId = req.params.id;

    const service = await prisma.service.findFirst({
      where: { id: serviceId },
    });

    if (!service) {
      return next(new NotFoundError("Service not found!"));
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Service deleted successfully!"));
  } catch (error) {
    next(error);
  }
};
