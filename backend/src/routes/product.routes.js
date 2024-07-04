import { Router } from 'express';
import { uploadProductImage } from '../middlewares/product.middleware.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductsInStock,
    getTopProducts,
    updateProductInfo
} from '../controllers/product.controller.js';

const router = Router();

router.route("/create-product").post(
    verifyJWT,
    verifyAdmin,
    uploadProductImage.fields([
        {
            name: "productImages",
            maxCount: 10,
        }
    ]),
    createProduct
);

router.route("/all-products").get(verifyJWT, getAllProducts);

router.route("/get-product/:id").get(verifyJWT, getProductById);

router.route("/update-product-info/:id").post(verifyJWT, verifyAdmin, updateProductInfo);

router.route("/delete-product/:id").delete(verifyJWT, verifyAdmin, deleteProduct);

router.route("/get-top-products").get(verifyJWT, getTopProducts);

router.route("/get-products-in-stock").get(verifyJWT, getProductsInStock);

export default router;