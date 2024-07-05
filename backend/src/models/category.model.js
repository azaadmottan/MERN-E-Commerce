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
    }
},
{timestamps: true});

export const Category = mongoose.model('Category', categorySchema);