import { isValidObjectId } from 'mongoose';
import crypto from "crypto";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { Payment } from '../models/payment.model.js';
import { Wallet } from "../models/wallet.model.js";

// process order payment
const processOrderPayment = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { orderId, amount, email, currency="rupee", cardNumber, cardHolderName, expiryDate, cvv } = req.body;

    if (!isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid order ID.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.status === 'Canceled' || order.status === 'Completed') {
        throw new ApiError(400, "Order is already processed or canceled.");
    }

    const generatePaymentId  = () => {
        const timestamp = Date.now().toString(36); // Convert current timestamp to a base-36 string
        const randomString = crypto.randomBytes(6).toString('hex'); // Generate a random 12-character hex string
        return `${timestamp}-${randomString}`;
    };

    const paymentId = generatePaymentId();

    const payment = new Payment({
        user,
        email,
        order: orderId,
        paymentId,
        amount,
        currency,
        status: 'Completed',
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
    });

    const newPayment = await payment.save();

    if (!newPayment) {
        throw new ApiError(500, "Payment process failed.");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';
    order.paymentInfo = newPayment?._id;

    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { newPayment },
            "Payment processed successfully.",
        )
    );
});

// get all payments
const getAllPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find();
    // const payments = await Payment.find().populate('user order');

    if (!payments) {
        throw new ApiError(404, 'No payments found.');
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { payments },
            "Payments fetched successfully.",
        ),
    );
});

// get single payment
const getSinglePaymentById = asyncHandler(async (req, res) => {
    const paymentId = req.params?.id;

    if (!isValidObjectId(paymentId)) {
        throw new ApiError(400, "Invalid payment ID.");
    }

    const payment = await Payment.findById(paymentId).populate('user order');

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    let userUpiDetails = null;
    if (payment?.user?._id) {
        userUpiDetails = await Wallet.findOne({ user: payment?.user?._id }).select("-upiPassword -balance -transactions");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                payment,
                userUpiDetails,
            },
            "Payment information fetched successfully.",
        )
    );
});

export {
    processOrderPayment,
    getAllPayments,
    getSinglePaymentById,
}