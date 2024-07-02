import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
    },
    profilePicture: {
        type: String,
        required: [true, "Profile picture is required"]
    },
    refreshToken: {
        type: String,
    }
}, 
{timestamps: true}
);

// match password of user for logging in
userSchema.method.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// generate hash of the user password if password is modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// generate access token
userSchema.method.generateAccessToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            fullName: this.fullName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
        }
    );
}

// generate refresh token
userSchema.method.generateRefreshToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
        }
    );
}

export const User = mongoose.model('User', userSchema);