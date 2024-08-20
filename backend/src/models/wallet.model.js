import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const walletSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upiId: {
        type: String,
        required: true,
        unique: true,
    },
    upiPassword: {
        type: String,
        required: true,
        minlength: 8,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    officialOrderUpiId: {
        type: Boolean,
        default: false,
    }
},
{timestamps: true});

walletSchema.pre('save', async function(next) {
    if (!this.isModified('upiPassword')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.upiPassword = await bcrypt.hash(this.upiPassword, salt);
});

walletSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.upiPassword);
}

export const Wallet = mongoose.model('Wallet', walletSchema);