import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
},
{timestamps: true});

export const Payment = mongoose.model('Payment', paymentSchema);