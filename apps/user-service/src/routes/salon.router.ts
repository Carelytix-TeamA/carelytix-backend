import express, { Router } from "express";
import { isAuthenticated } from "@carelytix/middleware/auth";
import {
  createSalon,
  deleteSalon,
  getAllSalons,
  getSingleSalon,
  updateSalon,
} from "../controllers/salon.controller.js";

const router: Router = express.Router();

router.post("/create-salon", isAuthenticated, createSalon);
router.get("/get-all-salons", isAuthenticated, getAllSalons);
router.get("/get-salon/:id", isAuthenticated, getSingleSalon);
router.put("/update-salon/:id", isAuthenticated, updateSalon);
router.delete("/delete-salon/:id", isAuthenticated, deleteSalon);

export default router;
