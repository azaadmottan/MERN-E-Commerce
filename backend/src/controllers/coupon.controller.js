import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Coupon } from '../models/coupon.model.js';

// create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
    const { code, expiryDate, discountType, discountValue } = req.body;

    if (!code || !expiryDate || !discountType || !discountValue) {
        throw new ApiError(400, "All fields must be provided.");
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
        throw new ApiError(409, "Coupon code is already exists.");
    }

    const newCoupon = await Coupon.create({
        code,
        expiryDate,
        discountType,
        discountValue,
    });

    if (!newCoupon) {
        throw new ApiError(500, "Failed to create coupon.");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            newCoupon,
            "Coupon created successfully.",
        )
    );
});

// get single coupon by id
const getSingleCoupon = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid coupon ID.");
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found.");
    }

    return res.json(
        new ApiResponse(
            200,
            coupon,
            "Coupon fetched successfully.",
        )
    );
});

// get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});

    if (!coupons) {
        throw new ApiError(404, "No coupon found.");
    }

    return res.json(
        new ApiResponse(
            200,
            {
                coupons,
                count: coupons.length,
            },
            "Coupons fetched successfully.",
        )
    );
});

// get active coupons
const getActiveCoupons = asyncHandler(async (req, res) => {
    const activeCoupons = await Coupon.find({ isActive: true });

    if (!activeCoupons) {
        throw new ApiError(404, "No active coupon found.");
    }

    return res.json(
        new ApiResponse(
            200,
            {
                activeCoupons,
                count: activeCoupons.length,
            },
            "Active coupons fetched successfully.",
        )
    );
});

// update coupon by id
const updateCoupon = asyncHandler(async (req, res) => {
    const couponId = req.params.id;
    const { code, expiryDate, discountType, discountValue, isActive } = req.body;

    if (!isValidObjectId(couponId)) {
        throw new ApiError(400, "Invalid coupon ID.");
    }

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found.");
    }

    const existingCoupon = code !== "" ? await Coupon.findOne({ code, _id: { $ne: couponId } }) : false;
    
    if (existingCoupon) {
        throw new ApiError(409, "Coupon code is already exists.");
    }

    coupon.code = code || coupon.code;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.isActive = isActive || coupon.isActive;

    const updatedCoupon = await coupon.save();

    if (!updatedCoupon) {
        throw new ApiError(500, "Failed to update coupon.");
    }

    return res.json(
        new ApiResponse(
            200,
            updatedCoupon,
            "Coupon updated successfully.",
        )
    );
});

// delete coupon by id
const deleteCoupon = asyncHandler(async (req, res) => {
    const couponId = req.params.id;

    if (!isValidObjectId(couponId)) {
        throw new ApiError(400, "Invalid coupon ID.");
    }

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
        throw new ApiError(404, "Coupon not found.");
    }

    return res.json(
        new ApiResponse(
            200,
            coupon,
            "Coupon deleted successfully"
        )
    );
});


export {
    createCoupon,
    getSingleCoupon,
    getAllCoupons,
    getActiveCoupons,
    updateCoupon,
    deleteCoupon,
}