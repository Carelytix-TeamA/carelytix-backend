import express, { Router } from "express";
import {
  addFeatureToModule,
  createModule,
  getAllModules,
  getModuleById,
  removeFeatureFromModule,
  updateModule,
} from "../controller/module.controller";

const router: Router = express.Router();

router.post("/create-modules", createModule);
router.get("/get-all-modules", getAllModules);
router.get("/get-module/:id", getModuleById);
router.patch("/update-module/:id", updateModule);
router.put("/module/:id/features", addFeatureToModule);
router.delete("/module/:id/features", removeFeatureFromModule);

export default router;
