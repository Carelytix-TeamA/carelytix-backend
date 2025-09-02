import express, { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getMemberById,
  updateMember,
} from "../controller/member.controller";

const router: Router = express.Router();

router.post("/create-member", createMember);
router.get("/get-all-members", getAllMembers);
router.get("/get-member/:id", getMemberById);
router.put("/update-member/:id", updateMember);
router.delete("/delete-member/:id", deleteMember);

export default router;
