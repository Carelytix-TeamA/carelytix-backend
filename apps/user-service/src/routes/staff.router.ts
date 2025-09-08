import express, { Router } from "express";
import { isAuthenticated } from "@carelytix/middleware/auth";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staff.controller.js";

const router: Router = express.Router();

router.post("/create-staff", isAuthenticated, createStaff);
router.get("/get-all-staffs", isAuthenticated, getAllStaff);
router.get("/get-staff/:id", isAuthenticated, getStaffById);
router.put("/update-staff/:id", isAuthenticated, updateStaff);
router.delete("/delete-staff/:id", isAuthenticated, deleteStaff);

export default router;
