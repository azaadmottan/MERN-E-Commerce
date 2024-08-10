import { isValidObjectId } from 'mongoose';
import crypto from "crypto";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Transaction } from '../models/transaction.model.js';
import { Wallet } from '../models/wallet.model.js';
import { Payment } from '../models/payment.model.js';

// create wallet or activate
const createWallet = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { upiId, upiPassword, isActive=true } = req.body;

    if (!isValidObjectId(user)) {
        throw new ApiError(400, "User must be provided.");
    }

    if (!upiId || !upiPassword) {
        throw new ApiError(400, "UPI ID & UPI Password must be provided.");
    }

    const wallet = await Wallet.findOne({ user });

    if (wallet) {
        throw new ApiError(400, "Wallet already exists.");
    }

    const newWallet = await Wallet.create({ user, upiId, upiPassword, isActive });

    if (!newWallet) {
        throw new ApiError(500, "Failed to create wallet.");
    }

    const userWallet = await Wallet.findById(newWallet?._id).select("-upiPassword");

    res.status(201).json(
        new ApiResponse(201, { userWallet }, "Wallet created successfully")
    );
});

// get user wallet
const getUserWallet = asyncHandler(async (req, res) => {
    const user = req.user?._id;

    if (!isValidObjectId(user)) {
        throw new ApiError(400, "User must be provided.");
    }

    const wallet = await Wallet.findOne({ user }).populate("transactions");

    if (!wallet) {
        throw new ApiError(404, "Wallet not found.");
    }

    res.status(200).json(
        new ApiResponse(200, { wallet }, "Wallet fetched successfully")
    );
});

// create transaction
const createTransaction = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const { senderUpiId, receiverUpiId, amount, description, upiPassword, paymentStatus } = req.body;

    if (!senderUpiId || !receiverUpiId || !amount) {
        return new ApiError(400, "Receiver id and amount must be provided");
    }

    if (!upiPassword) {
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

    const isPasswordValid = await senderWallet.matchPassword(upiPassword);

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
        description,
        status: "Completed",
    });

    if (!newTransaction) {
        throw new ApiError(500, "Failed to create transaction.");
    }

    senderWallet?.transactions.push(newTransaction?._id);
    receiverWallet?.transactions.push(newTransaction?._id);

    const senderUpdatedWallet = await senderWallet.save();
    const receiverUpdatedWallet = await receiverWallet.save();
    
    if (paymentStatus) {
        await Payment.findOneAndUpdate({ user: receiverUpdatedWallet?.user })
        .set({ status: paymentStatus });
    }

    res.status(201).json(
        new ApiResponse(201, { newTransaction }, "Transaction created successfully.")
    );
});

export {
    createWallet,
    getUserWallet,
    createTransaction,
}