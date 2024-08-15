import mongoose, { Schema } from 'mongoose';

const couponSchema = Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        required: true,
        enum: ['Percentage', 'Amount'], // Can be 'percentage' or 'amount'
    },
    discountValue: {
        type: Number,
        required: true,
    },
    noOfItems: {
        type: Number,
        required: true,
        default: 0,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
},
{timestamps: true});

export const Coupon = mongoose.model('Coupon', couponSchema);