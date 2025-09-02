import express, { Router } from "express";
import {
  addModuleToPlan,
  createPlan,
  getAllPlans,
  getPlanById,
  removeModuleFromPlan,
  updatePlan,
} from "../controller/plan.controller.js";

const router: Router = express.Router();

router.post("/create-plan", createPlan);
router.get("/get-all-plans", getAllPlans);
router.get("/get-plan/:id", getPlanById);
router.put("/update-plan/:id", updatePlan);
router.put("/plan/:id/modules", addModuleToPlan);
router.delete("/plan/:id/modules", removeModuleFromPlan);

export default router;
