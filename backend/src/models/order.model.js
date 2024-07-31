import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    paymentInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        // required: true,
    },
    shippingPrice: { 
        type: Number, 
        required: true, 
        default: 20.00,
    },
    totalPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    isPaid: { 
        type: Boolean, 
        default: false 
    },
    paidAt: { 
        type: Date,
    },
    isDelivered: { 
        type: Boolean, 
        default: false,
    },
    deliveredAt: { 
        type: Date, 
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    }
},
{timestamps: true});

export const Order = mongoose.model('Order', orderSchema);