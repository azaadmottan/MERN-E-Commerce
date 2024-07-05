import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory
} from '../controllers/category.controller.js';


const router = Router();

router.route("/create-category").post(verifyJWT, verifyAdmin, createCategory);

router.route("/all-categories").get(verifyJWT, getAllCategories);

router.route("/get-category/:id").get(verifyJWT, getSingleCategory);

router.route("/update-category/:id").post(verifyJWT, verifyAdmin, updateCategory);

router.route("/delete-category/:id").delete(verifyJWT, verifyAdmin, deleteCategory);

export default router;