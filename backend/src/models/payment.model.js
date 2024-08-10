import mongoose, { Schema } from 'mongoose';
import crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.PAYMENT_ENCRYPTION_KEY, 'hex');

// Encrypt the data
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decrypt the data
const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled', 'Refunded'],
    },
    email: {
        type: String,
        required: true,
    },
    cardHolderName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
},
{timestamps: true});

paymentSchema.pre('save', function (next) {
    if (this.isModified('cardNumber')) {
        this.cardNumber = encrypt(this.cardNumber);
    }
    if (this.isModified('expiryDate')) {
        this.expiryDate = encrypt(this.expiryDate);
    }
    if (this.isModified('cvv')) {
        this.cvv = encrypt(this.cvv);
    }
    next();
});

export const Payment = mongoose.model('Payment', paymentSchema);