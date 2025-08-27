import express, { Router } from "express";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  getSingleBranch,
  updateBranch,
} from "../controllers/branch.controller.js";

const router: Router = express.Router();

router.post("/create-branch", createBranch);
router.get("/get-all-branches", getAllBranches);
router.get("/get-branch/:id", getSingleBranch);
router.put("/update-branch/:id", updateBranch);
router.delete("/delete-branch/:id", deleteBranch);

export default router;
