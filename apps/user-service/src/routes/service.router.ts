import express, { Router } from "express";
import { isAuthenticated } from "@carelytix/middleware/auth";
import {
  createService,
  deleteService,
  getAllServices,
  getSingleService,
  updateService,
} from "src/controllers/service.controller.js";

const router: Router = express.Router();

router.post("/create-service", isAuthenticated, createService);
router.post("/get-all-services", isAuthenticated, getAllServices);
router.post("/get-service/:id", isAuthenticated, getSingleService);
router.post("/update-service/:id", isAuthenticated, updateService);
router.post("/delete-service/:id", isAuthenticated, deleteService);

export default router;
