import { isValidObjectId } from 'mongoose';
import crypto from "crypto";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { Payment } from '../models/payment.model.js';
import { Coupon } from "../models/coupon.model.js";

// create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, shippingPrice = 80, code } = req.body;

    if (!isValidObjectId(shippingAddress)) {
        throw new ApiError(400, "Shipping address must be provided.");
    }

    if (orderItems && orderItems.length === 0) {
        throw new ApiError(400, 'No order item found, please select a new order item');
    }

    let items = [];
    let finalTotalPrice = 0;

    // for (let item of orderItems) {
    orderItems.map((item) => {
        const price = item?.product?.sellingPrice;
        const totalPrice = price * item?.quantity;
        
        items.push({
            product: item?.product?._id,
            qty: item?.quantity,
            price: price,
        });

        finalTotalPrice += totalPrice;
    });

    let coupon = "";
    // apply coupon code if provided
    if (code) {
        coupon = await Coupon.findOne({ code });
        
        if (!coupon) {
            throw new ApiError(404, "Invalid Coupon Code.");
        }
        
        if (coupon.noOfItems > orderItems.length) {
            throw new ApiError(400, "Coupon is not applicable for this number of items.");
        }

        finalTotalPrice -= (coupon.discountType === "Amount") ? coupon.discountValue : (finalTotalPrice * coupon.discountValue) / 100;
        
        if (finalTotalPrice < 0) {
            throw new ApiError(400, "Coupon discount exceeds the total order price.");
        }

        coupon.isActive = false;
        coupon.user = req.user?._id;
    }
    
    const order = await Order.create({
        user: req.user?._id,
        orderItems: items,
        shippingAddress,
        shippingPrice: finalTotalPrice > 500 ? 0 : 80,
        totalPrice: finalTotalPrice,
        coupon: coupon?._id,
    });
    
    if (!order) {
        throw new ApiError(500, "Failed to create order.");
    }
    
    if (code) {
        coupon.order = order?._id;
        await coupon.save();
    }

    res.status(201).json(
        new ApiResponse(
            201,
            { order },
            "Order created successfully.",
        ),
    );
});

// get all user orders
const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orders = await Order.find({ user: userId }).populate('orderItems.product');

    if (!orders) {
        throw new ApiError(404, 'No orders found for this user.');
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { orders },
            "Orders fetched successfully.",
        ),
    );
});

// get single orders
const getSingleOrder = asyncHandler(async (req, res) => {
    const orderId = req.params?.orderId;

    const order = await Order.findById(orderId).populate('orderItems.product');
    
    if (!order) {
        throw new ApiError(404, 'No order found.');
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { order },
            "Order fetched successfully.",
        ),
    );
});

// get order information
const getOrderInfo = asyncHandler(async (req, res) => {
    const orderId = req.params?.orderId;

    const order = await Order.findById(orderId)
        .populate('user').select('-password -isAdmin')
        .populate('orderItems.product')
        .populate('paymentInfo').select('-cardNumber -cardExpiry -cvv')
        .populate('shippingAddress');
    
    if (!order) {
        throw new ApiError(404, 'No order found.');
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { order },
            "Order fetched successfully.",
        ),
    );
});

// get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('orderItems.product');

    if (!orders) {
        throw new ApiError(404, 'No orders found.');
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { orders },
            "Orders fetched successfully.",
        ),
    );
});

// update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params?.orderId;
    const { status, deliveredAt="" } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'No order found.');
    }

    order.status = status;
    if (deliveredAt) {
        order.deliveredAt = deliveredAt;
    }
    if (status === "Delivered") {
        order.isDelivered = true;
    }
    if (status === "Cancelled") {
        order.isCancelled = true;
        order.orderCancelledAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json(
        new ApiResponse(
            200,
            { order: updatedOrder },
            "Order status updated successfully.",
        ),
    );
});

export {
    createOrder,
    getUserOrders,
    getSingleOrder,
    getOrderInfo,
    getAllOrders,
    updateOrderStatus,
}