import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    getAllPayments,
    getSinglePaymentById,
    processOrderPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/process-payment").post(verifyJWT, processOrderPayment);

router.route("/get-all-payments").post(verifyJWT, verifyAdmin, getAllPayments);

router.route("/get-single-payment/:id").post(verifyJWT, verifyAdmin, getSinglePaymentById);

export default router;