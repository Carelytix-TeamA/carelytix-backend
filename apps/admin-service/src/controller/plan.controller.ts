import { validateData } from "@carelytix/utils/validation";
import { NextFunction, Request, Response } from "express";
import {
  addModuleToPlanSchema,
  createPlanSchema,
  removeModuleFromPlanSchema,
  updatePlanSchema,
} from "../utils/schema.js";
import { AuthError } from "@carelytix/utils/error-handler";
import { ZodError } from "zod";
import { prisma } from "@carelytix/db";
import { ApiResponse } from "@carelytix/utils/responce";

export const createPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createPlanSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { name, module_ids } = result;

    const plan = await prisma.plan.create({
      data: {
        name,
      },
    });

    await Promise.all(
      module_ids.map(async (moduleId) => {
        return prisma.planModuleMapping.create({
          data: {
            planId: plan.id,
            moduleId,
          },
        });
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { plan }, "Plan created!"));
  } catch (error) {
    next(error);
  }
};

export const getAllPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        moduleMappings: {
          where: {
            isActive: true,
          },
          include: {
            module: {
              include: {
                featureMappings: {
                  where: {
                    isActive: true,
                  },
                  include: {
                    feature: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            userMappings: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { plans }, "Plans fetched successfully!"));
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.params.id;

    if (!planId) {
      return next(new AuthError("Please provide plan id!"));
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        moduleMappings: {
          where: {
            isActive: true,
          },
          include: {
            module: {
              include: {
                featureMappings: {
                  where: {
                    isActive: true,
                  },
                  include: {
                    feature: true,
                  },
                },
              },
            },
          },
        },
        userMappings: {
          where: {
            isActive: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            userMappings: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      return next(new AuthError("Plan not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { plan }, "Plan fetched!"));
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.params.id;
    const result = validateData(updatePlanSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    if (!planId) {
      throw new AuthError("Plan ID is required");
    }

    const { name, planMeta } = result;
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AuthError("Plan not found");
    }

    const planWithSameName = await prisma.plan.findFirst({
      where: {
        name,
        id: {
          not: planId,
        },
      },
    });

    if (planWithSameName) {
      throw new AuthError("Plan name already exists");
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        name,
        ...(planMeta && { planMeta }),
      },
      include: {
        moduleMappings: {
          where: {
            isActive: true,
          },
          include: {
            module: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { plan: updatedPlan }, "Plan updated!"));
  } catch (error) {
    next(error);
  }
};

export const addModuleToPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.params.id;
    const result = validateData(addModuleToPlanSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    if (!planId) {
      throw new AuthError("Plan ID is required");
    }

    const { module_ids } = result;
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AuthError("Plan not found");
    }

    const modules = await prisma.module.findMany({
      where: {
        id: {
          in: module_ids,
        },
      },
    });

    if (modules.length !== module_ids.length) {
      throw new AuthError("One or more modules not found");
    }

    const existingMappings = await prisma.planModuleMapping.findMany({
      where: {
        planId: planId,
        moduleId: {
          in: module_ids,
        },
        isActive: true,
      },
    });

    const existingModuleIds = existingMappings.map(
      (mapping) => mapping.moduleId
    );
    const newModuleIds = module_ids.filter(
      (moduleId) => !existingModuleIds.includes(moduleId)
    );

    if (newModuleIds.length === 0) {
      throw new AuthError(
        "All specified modules are already added to this plan"
      );
    }

    await Promise.all(
      newModuleIds.map(async (moduleId) => {
        return prisma.planModuleMapping.create({
          data: {
            planId: planId,
            moduleId,
          },
        });
      })
    );

    const updatedPlan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        moduleMappings: {
          where: {
            isActive: true,
          },
          include: {
            module: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { plan: updatedPlan },
          `${newModuleIds.length} module(s) added to plan successfully!`
        )
      );
  } catch (error) {
    next(error);
  }
};

export const removeModuleFromPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.params.id;
    const result = validateData(removeModuleFromPlanSchema, req.body);

    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    if (!planId) {
      throw new AuthError("Plan ID is required");
    }

    const { module_ids } = result;
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AuthError("Plan not found");
    }

    const existingMappings = await prisma.planModuleMapping.findMany({
      where: {
        planId: planId,
        moduleId: {
          in: module_ids,
        },
        isActive: true,
      },
    });

    if (existingMappings.length === 0) {
      throw new AuthError(
        "None of the specified modules are currently in this plan"
      );
    }

    await prisma.planModuleMapping.deleteMany({
      where: {
        planId: planId,
        moduleId: {
          in: module_ids,
        },
        isActive: true,
      },
    });

    const updatedPlan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        moduleMappings: {
          where: {
            isActive: true,
          },
          include: {
            module: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { plan: updatedPlan },
          `${existingMappings.length} module(s) removed from plan successfully!`
        )
      );
  } catch (error) {
    next(error);
  }
};
