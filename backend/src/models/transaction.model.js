import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    transactionType: {
        type: String,
        enum: ['Purchase', 'Refund', 'Withdrawal'], // Can be 'purchase', 'refund', or 'withdrawal'
    },
    amount: {
        type: Number,
        required: true,
    },
    senderUpiId: {
        type: String,
        required: true,
    },
    receiverUpiId: {
        type: String,
        required: true,
    },
    referenceId: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
},
{timestamps: true});

export const Transaction = mongoose.model('Transaction', transactionSchema);