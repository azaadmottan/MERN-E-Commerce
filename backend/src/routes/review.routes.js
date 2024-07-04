import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createReview,
    deleteReview,
    getAllReviews,
    getProductReviews,
    getSingleReview
} from '../controllers/review.controller.js';


const router = Router();

router.route("/create-review/:id").post(verifyJWT, createReview);

router.route("/all-reviews").get(verifyJWT, getAllReviews);

router.route("/get-review/:id").get(verifyJWT, getSingleReview);

router.route("/product-reviews/:id").get(verifyJWT, getProductReviews);

router.route("/delete-review/:id").delete(verifyJWT, deleteReview);

export default router;