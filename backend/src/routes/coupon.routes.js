import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createCoupon,
    deleteCoupon,
    getActiveCoupons,
    getAllCoupons,
    getSingleCoupon,
    updateCoupon
} from '../controllers/coupon.controller.js';


const router = Router();

router.route("/create-coupon").post(verifyJWT, verifyAdmin, createCoupon);

router.route("/get-coupon/:id").get(verifyJWT, verifyAdmin, getSingleCoupon);

router.route("/all-coupons").get(verifyJWT, verifyAdmin, getAllCoupons);

router.route("/active-coupons").get(verifyJWT, verifyAdmin, getActiveCoupons);

router.route("/update-coupon/:id").post(verifyJWT, verifyAdmin, updateCoupon);

router.route("/delete-coupon/:id").delete(verifyJWT, verifyAdmin, deleteCoupon);

export default router;
