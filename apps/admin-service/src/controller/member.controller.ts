import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { createMemberSchema, updateMemberSchema } from "../utils/schema.js";
import { ZodError } from "zod";
import { AuthError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@carelytix/utils/responce";

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(createMemberSchema, req.body);
    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { name, email_id, password } = result;
    const existingMember = await prisma.member.findUnique({
      where: { email: email_id },
    });
    if (existingMember) {
      return next(
        new ValidationError("Member already exists with this email!")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = await prisma.member.create({
      data: {
        name,
        email: email_id,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, member, "Member created!"));
  } catch (error) {
    return next(error);
  }
};

export const getAllMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await prisma.member.findMany();

    return res
      .status(200)
      .json(new ApiResponse(200, members, "Members fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findUnique({ where: { id: memberId } });

    return res
      .status(200)
      .json(new ApiResponse(200, member, "Member fetched!"));
  } catch (error) {
    return next(error);
  }
};

export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.params.id;

    const result = validateData(updateMemberSchema, req.body);

    if (result instanceof ZodError) {
      throw new AuthError(result.message || "Invalid request data");
    }

    const { name, email_id, password } = result;

    const member = await prisma.member.findUnique({ where: { id: memberId } });

    if (!member) {
      return next(new ValidationError("Member not found!"));
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        name,
        email: email_id,
        password,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedMember, "Member updated!"));
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.params.id;
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return next(new ValidationError("Member not found!"));
    }
    await prisma.member.delete({ where: { id: memberId } });
    return res.status(200).json(new ApiResponse(200, null, "Member deleted!"));
  } catch (error) {
    next(error);
  }
};
