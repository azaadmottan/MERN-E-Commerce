import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/product.model.js';
import { Review } from '../models/review.model.js';

// create a new review
const createReview = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    if (!rating) {
        throw new ApiError(400, "Rating is required.");
    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }
    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment is required.");
    }
    
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    const newReview = await Review.create({
        user: req.user?._id,
        product: productId,
        rating,
        comment,
    });

    if (!newReview) {
        throw new ApiError(500, "Failed to create review.");
    }

    // const updatedProduct = await Product.findByIdAndUpdate(
    //     productId,
    //     { $push: { reviews: newReview._id } },
    //     { new: true }
    // ).populate("reviews", "-__v");

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            newReview,
            "Review created successfully.",
        )
    );
});

// get all reviews
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({});

    if (!reviews) {
        throw new ApiError(404, "No review found.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                reviews,
                count: reviews.length
            },
            "Reviews fetched successfully.",
        )
    );
});

// get a single review by its id
const getSingleReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid review ID.");
    }

    const review = await Review.findById(reviewId).populate("user", "-password -refreshToken");

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            review,
            "Review fetched successfully.",
        )
    );
});

// get reviews for the specified product 
const getProductReviews = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    
    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    const reviews = await Review.find({ product: productId }).populate("user", "-password -refreshToken");

    if (!reviews) {
        throw new ApiError(404, "No review found for this product.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                reviews,
                count: reviews.length
            },
            "Reviews fetched successfully.",
        )
    );
});

// delete review
const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid review ID.");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }
    if (review.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review.");
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        throw new ApiError(500, "Failed to delete review.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            deletedReview,
            "Review deleted successfully.",
        )
    );
});

export {
    createReview,
    getAllReviews,
    getSingleReview,
    getProductReviews,
    deleteReview,
}