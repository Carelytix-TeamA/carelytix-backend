import { validateData } from "@carelytix/utils/validation";
import { NextFunction, Request, Response } from "express";
import {
  addFeatureToModuleSchema,
  createModuleSchema,
  removeFeatureFromModuleSchema,
  updateModuleSchema,
} from "../utils/schema";
import { ZodError } from "zod";
import { AuthError, NotFoundError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";

export const createModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createModuleSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }
    const { name } = result;

    const module = await prisma.module.create({
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { module }, "Module created!"));
  } catch (error) {
    next(error);
  }
};

export const getAllModules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const modules = await prisma.module.findMany();

    if (!modules) {
      return next(new NotFoundError("No Modules Found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, modules, "Modules fetched!"));
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = req.params.id;
    const module = await prisma.module.findUnique({ where: { id: moduleId } });

    if (!module) {
      return next(new NotFoundError("Module not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, module, "Module fetched!"));
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new NotFoundError("Please provide module id!"));
    }

    const result = validateData(updateModuleSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }
    const { name } = result;
    const module = await prisma.module.update({
      where: { id: moduleId },
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { module }, "Module updated!"));
  } catch (error) {
    next(error);
  }
};

export const addFeatureToModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new NotFoundError("Please provide module id!"));
    }

    const result = validateData(addFeatureToModuleSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { feature_ids } = result;

    const module = await prisma.module.findUnique({ where: { id: moduleId } });

    if (!module) {
      return next(new NotFoundError("Module not found!"));
    }

    const features = await prisma.feature.findMany({
      where: { id: { in: feature_ids } },
    });

    if (features.length === 0) {
      return next(new NotFoundError("Features not found!"));
    }

    const existingMappings = await prisma.moduleFeatureMapping.findMany({
      where: {
        moduleId: moduleId,
        featureId: { in: feature_ids },
      },
    });

    const existingFeatureIds = existingMappings.map(
      (mapping) => mapping.featureId
    );
    const newFeatureIds = feature_ids.filter(
      (id) => !existingFeatureIds.includes(id)
    );

    if (newFeatureIds.length === 0) {
      return next(new NotFoundError("Features already added to module!"));
    }

    await Promise.all(
      newFeatureIds.map(async (feature_id) => {
        return prisma.moduleFeatureMapping.create({
          data: {
            moduleId: moduleId,
            featureId: feature_id,
          },
        });
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { module }, "Features added to module!"));
  } catch (error) {
    next(error);
  }
};

export const removeFeatureFromModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new NotFoundError("Please provide module id!"));
    }

    const result = validateData(removeFeatureFromModuleSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { feature_ids } = result;

    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      return next(new NotFoundError("Module not found!"));
    }

    const features = await prisma.feature.findMany({
      where: { id: { in: feature_ids } },
    });
    if (features.length === 0) {
      return next(new NotFoundError("Features not found!"));
    }

    const existingMappings = await prisma.moduleFeatureMapping.findMany({
      where: {
        moduleId: moduleId,
        featureId: { in: feature_ids },
      },
    });

    if (existingMappings.length === 0) {
      return next(new NotFoundError("No feature mappings found to remove!"));
    }

    await Promise.all(
      existingMappings.map(async (mapping) => {
        return prisma.moduleFeatureMapping.delete({
          where: {
            id: mapping.id,
          },
        });
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { module }, "Features removed!"));
  } catch (error) {
    next(error);
  }
};
