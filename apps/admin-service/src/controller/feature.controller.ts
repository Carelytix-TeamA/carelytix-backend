import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { createFeatureSchema, updateFeatureSchema } from "../utils/schema.js";
import { ZodError } from "zod";
import { AuthError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";

export const createFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createFeatureSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }
    const { name } = result;

    const feature = await prisma.feature.create({
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { feature }, "Feature created!"));
  } catch (error) {
    next(error);
  }
};

export const getAllFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const features = await prisma.feature.findMany();

    return res
      .status(200)
      .json(new ApiResponse(200, features, "Features fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const getFeatureById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const featureId = req.params.id;
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, feature, "Feature fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const updateFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const featureId = req.params.id;
    const result = validateData(updateFeatureSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }
    const { name } = result;
    const feature = await prisma.feature.update({
      where: { id: featureId },
      data: {
        name,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { feature }, "Feature updated!"));
  } catch (error) {
    return next(error);
  }
};

export const deleteFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const featureId = req.params.id;
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });
    if (!feature) {
      return next(new ValidationError("Feature not found!"));
    }
    await prisma.feature.delete({ where: { id: featureId } });
    return res.status(200).json(new ApiResponse(200, null, "Feature deleted!"));
  } catch (error) {
    next(error);
  }
};
