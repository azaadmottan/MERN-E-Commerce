import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createOrder,
    getAllOrders,
    getOrderInfo,
    getSingleOrder,
    getUserOrders,
    updateOrderStatus,
} from '../controllers/order.controller.js';

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);

router.route("/get-user-orders").get(verifyJWT, getUserOrders);

router.route("/get-single-order/:orderId").get(verifyJWT, getSingleOrder);

router.route("/get-order-info/:orderId").get(verifyJWT, getOrderInfo);

router.route("/get-all-orders").get(verifyJWT, getAllOrders);

router.route("/update-order-status/:orderId").post(verifyJWT, updateOrderStatus);

export default router;