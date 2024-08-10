import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createTransaction,
    createWallet,
    getUserWallet
} from '../controllers/wallet.controller.js';

const router = Router();

router.route("/create-wallet").post(verifyJWT, createWallet);

router.route("/get-wallet").get(verifyJWT, getUserWallet);

router.route("/create-transaction").post(verifyJWT, createTransaction);

export default router;