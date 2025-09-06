import express, { Router } from "express";
import {
  userRegistration,
  refreshToken,
  loginUser,
  logoutUser,
  getUser,
} from "../controller/auth.controller.js";
import { isAuthenticated } from "@carelytix/middleware/auth";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.post("/logout-user", logoutUser);
router.get("/get-user", isAuthenticated, getUser);

export default router;
