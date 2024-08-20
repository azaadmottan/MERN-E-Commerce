import { isValidObjectId } from 'mongoose';
import crypto from "crypto";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { Payment } from '../models/payment.model.js';
import { Wallet } from "../models/wallet.model.js";
import { Transaction } from '../models/transaction.model.js';

// process order payment
const processOrderPayment = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { paymentMethod } = req.body;
    
    const generatePaymentId  = () => {
        const timestamp = Date.now().toString(36); // Convert current timestamp to a base-36 string
        const randomString = crypto.randomBytes(6).toString('hex'); // Generate a random 12-character hex string
        return `${timestamp}${randomString}`;
    };
    
    if (paymentMethod === "card") {
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
    
        const paymentId = generatePaymentId();
    
        const payment = new Payment({
            user,
            email,
            order: orderId,
            paymentId,
            paymentMethod: 'Card',
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
    }
    else if (paymentMethod === "wallet") {
        const { orderId, senderUpiId, receiverUpiId, password, amount } = req.body;

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

        if (!senderUpiId || !receiverUpiId || !amount) {
            return new ApiError(400, "Receiver id and amount must be provided");
        }
    
        if (!password) {
            throw new ApiError(400, "UPI Password must be provided.");
        }
    
        if (senderUpiId === receiverUpiId) {
            throw new ApiError(400, "Sender and receiver UPI-IDs should be different.");
        }
    
        const senderWallet = await Wallet.findOne({ upiId: senderUpiId });
    
        if (!senderWallet) {
            throw new ApiError(400, "Invalid sender UPI-Id.");
        }
    
        const receiverWallet = await Wallet.findOne({ upiId: receiverUpiId });
    
        if (!receiverWallet) {
            throw new ApiError(404, "Invalid receiver UPI-Id.");
        }
    
        if (senderWallet?.user?.toString() !== user?.toString()) {
            throw new ApiError(403, "You don't have permission to access this wallet.");
        }

        const isPasswordValid = await senderWallet.matchPassword(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid UPI Password.");
        }

        if (amount <= 0) {
            throw new ApiError(400, "Invalid transaction amount.");
        }

        if (amount > (senderWallet?.balance)) {
            throw new ApiError(400, "Insufficient balance in sender's wallet.");
        }

        senderWallet.balance = Number(senderWallet.balance) - Number(amount);
        receiverWallet.balance = Number(receiverWallet.balance) + Number(amount);

        const transactionRef = crypto.randomBytes(16).toString("hex");
        
        const newTransaction = await Transaction.create({
            user,
            senderUpiId,
            receiverUpiId,
            referenceId: transactionRef,
            amount,
            status: "Completed",
        });

        if (!newTransaction) {
            throw new ApiError(500, "Failed to create transaction.");
        }

        senderWallet?.transactions.push(newTransaction?._id);
        receiverWallet?.transactions.push(newTransaction?._id);

        const senderUpdatedWallet = await senderWallet.save();
        const receiverUpdatedWallet = await receiverWallet.save();

        const paymentId = generatePaymentId();

        const payment = new Payment({
            user,
            order: orderId,
            paymentId,
            paymentMethod: 'UPI',
            amount,
            status: 'Completed',
            senderUpiId,
            receiverUpiId,
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
    }
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

    const payment = await Payment.findById(paymentId).populate('user order').select("-password");

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