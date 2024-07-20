import { Router } from 'express';
import { uploadProductImage } from '../middlewares/product.middleware.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    additionalProductInfo,
    addNewProductImages,
    createProduct,
    deleteProduct,
    getAllProducts,
    getCategoryWiseProducts,
    getProductById,
    getProductsInStock,
    getTopProducts,
    removeProductImage,
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

router.route("/add-product-additional-info/:productId").post(verifyJWT, verifyAdmin, additionalProductInfo);

router.route("/all-products").get(getAllProducts);

router.route("/get-product/:id").get(getProductById);

router.route("/get-category-products/:categoryKeyword").get(getCategoryWiseProducts);

router.route("/update-product-info/:id").post(verifyJWT, verifyAdmin, updateProductInfo);

router.route("/add-product-images/:id").post(
    verifyJWT,
    verifyAdmin,
    uploadProductImage.fields([
        {
            name: "productImages",
            maxCount: 10,
        }
    ]),
    addNewProductImages
);

router.route("/remove-product-image/:id").post(verifyJWT, verifyAdmin, removeProductImage);

router.route("/delete-product/:id").delete(verifyJWT, verifyAdmin, deleteProduct);

router.route("/get-top-products").get(verifyJWT, getTopProducts);

router.route("/get-products-in-stock").get(verifyJWT, getProductsInStock);

export default router;