import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    }],
    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    paymentInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    taxPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    shippingPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    totalPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    isPaid: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    paidAt: { 
        type: Date,
    },
    isDelivered: { 
        type: Boolean, 
        required: true, 
        default: false,
    },
    deliveredAt: { 
        type: Date, 
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    }
},
{timestamps: true});

export const Order = mongoose.model('Order', orderSchema);