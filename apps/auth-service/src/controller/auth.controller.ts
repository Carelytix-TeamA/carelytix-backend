import { NextFunction, Request, Response } from "express";
import { validateData } from "@carelytix/utils/validation";
import { loginSchema, registerSchema } from "../utils/schema.js";
import { ZodError } from "zod";
import { AuthError, ValidationError } from "@carelytix/utils/error-handler";
import { prisma } from "@carelytix/db";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@carelytix/utils/responce";
import { setCookie } from "../utils/cookies/setCookie.js";
import { generateTokens, refreshAuthToken } from "../utils/token.js";
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(registerSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }
    const { name, email, password, primaryContactNo, userMeta } = result;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        primaryContactNo,
        userMeta,
        password: hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await generateTokens({
      id: user.id,
      email: user.email,
      userAgent: req.headers["user-agent"] as string,
      ipAddress: req.ip,
    });
    setCookie(res, "access-token", accessToken);
    setCookie(res, "refresh-token", refreshToken);
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully!"));
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validateData(loginSchema, req.body);
    if (result instanceof ZodError) {
      throw new ValidationError(result.message || "Invalid request data");
    }
    const { email, password } = result;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new AuthError("User doesn't not exist!"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return next(new AuthError("Invalid credentials!"));
    }
    const { accessToken, refreshToken } = await generateTokens({
      id: user.id,
      email: user.email,
      userAgent: req.headers["user-agent"] as string,
      ipAddress: req.ip,
    });
    setCookie(res, "access-token", accessToken);
    setCookie(res, "refresh-token", refreshToken);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          email: user.email,
        },
        "Login successful!"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies["access-token"] || req.headers.authorization?.split(" ")[1];
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAuthToken({
        refreshToken,
        userAgent: req.headers["user-agent"] as string,
        ipAddress: req.ip,
      });
    setCookie(res, "access-token", accessToken);
    setCookie(res, "refresh-token", newRefreshToken);
    return res.status(200).json(new ApiResponse(200, null, "Token refreshed!"));
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies["refresh-token"];
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
  setCookie(res, "access-token", "");
  setCookie(res, "refresh-token", "");
  return res.status(200).json(new ApiResponse(200, null, "Logout successful!"));
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully!"));
};
