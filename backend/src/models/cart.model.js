import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        }
    }]
},
{timestamps: true});

export const Cart = mongoose.model('Cart', cartSchema);