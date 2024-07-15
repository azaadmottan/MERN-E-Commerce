import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    categoryImage: {
        type: String,
        required: true,
    }
},
{timestamps: true});

export const Category = mongoose.model('Category', categorySchema);