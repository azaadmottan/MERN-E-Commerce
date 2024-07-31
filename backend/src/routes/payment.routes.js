import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    processOrderPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/process-payment").post(verifyJWT, processOrderPayment)

export default router;