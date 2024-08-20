import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    addOfficialOrderPaymentUpiId,
    createTransaction,
    createWallet,
    getOfficialOrderPaymentUpiId,
    getUserWallet,
    removeOfficialOrderPaymentUpiId
} from '../controllers/wallet.controller.js';

const router = Router();

router.route("/create-wallet").post(verifyJWT, createWallet);

router.route("/get-wallet").get(verifyJWT, getUserWallet);

router.route("/create-transaction").post(verifyJWT, createTransaction);

router.route("/add-official-order-upi-id").post(verifyJWT, verifyAdmin, addOfficialOrderPaymentUpiId);

router.route("/get-official-order-upi-id").get(verifyJWT, getOfficialOrderPaymentUpiId);

router.route("/remove-official-order-upi-id").post(verifyJWT, verifyAdmin, removeOfficialOrderPaymentUpiId);

export default router;