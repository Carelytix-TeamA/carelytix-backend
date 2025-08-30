import express, { Router } from "express";
import {
  createFeature,
  deleteFeature,
  getAllFeatures,
  getFeatureById,
  updateFeature,
} from "../controller/feature.controller";

const router: Router = express.Router();

router.post("/create-feature", createFeature);
router.get("/get-all-features", getAllFeatures);
router.get("/get-feature/:id", getFeatureById);
router.put("/update-feature/:id", updateFeature);
router.delete("/delete-feature/:id", deleteFeature);

export default router;
