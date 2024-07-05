import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    addToCart,
    clearCart,
    getUserCart,
    removeProductFromCart,
    updateProductQuantity
} from '../controllers/cart.controller.js';

const router = Router();

router.route("/user-cart").get(verifyJWT, getUserCart);

router.route("/add-to-cart").post(verifyJWT, addToCart);

router.route("/remove-product-from-cart").delete(verifyJWT, removeProductFromCart);

router.route("/update-product-quantity").post(verifyJWT, updateProductQuantity);

router.route("/clear-cart").delete(verifyJWT, clearCart);

export default router;