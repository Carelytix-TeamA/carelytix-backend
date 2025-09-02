import express, { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
} from "../controller/coupon.controller.js";

const router: Router = express.Router();

router.post("/create-coupon", createCoupon);
router.get("/get-all-coupons", getAllCoupons);
router.get("/get-coupon/:id", getCouponById);
router.put("/update-coupon/:id", updateCoupon);
router.delete("/delete-coupon/:id", deleteCoupon);

export default router;
