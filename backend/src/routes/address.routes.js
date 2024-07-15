import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    addAddress, 
    deleteAddress, 
    getLoggedInUserAddress, 
    getUserAddress,
    updateAddress
} from '../controllers/address.controller.js';

const router = Router();

router.route("/add-address").post(verifyJWT, addAddress);

router.route("/login-user-address").get(verifyJWT, getLoggedInUserAddress);

router.route("/user-address/:id").get(verifyJWT, getUserAddress);

router.route("/update-address/:id").post(verifyJWT, updateAddress);

router.route("/delete-address/:id").delete(verifyJWT, deleteAddress);

export default router;