import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createOrder,
    getSingleOrder,
    getUserOrders,
} from '../controllers/order.controller.js';

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);

router.route("/get-user-orders").get(verifyJWT, getUserOrders);

router.route("/get-single-order/:orderId").get(verifyJWT, getSingleOrder);

export default router;