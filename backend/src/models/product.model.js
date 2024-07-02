import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: null,
    }],
    numReviews: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    rating: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    price: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    discount: {
        type: Number, 
        required: true,
        default: 0
    },
    countInStock: { 
        type: Number, 
        required: true, 
        default: 0 
    },
},
{timestamps: true});

export const Product = mongoose.model('Product', productSchema);