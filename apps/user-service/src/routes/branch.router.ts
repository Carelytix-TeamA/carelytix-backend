import express, { Router } from "express";
import { isAuthenticated } from "@carelytix/middleware/auth";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  getSingleBranch,
  updateBranch,
} from "../controllers/branch.controller.js";

const router: Router = express.Router();

router.post("/create-branch", isAuthenticated, createBranch);
router.get("/get-all-branches", isAuthenticated, getAllBranches);
router.get("/get-branch/:id", isAuthenticated, getSingleBranch);
router.put("/update-branch/:id", isAuthenticated, updateBranch);
router.delete("/delete-branch/:id", isAuthenticated, deleteBranch);

export default router;
