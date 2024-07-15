import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Address } from '../models/address.model.js';

// create a new address
const addAddress = asyncHandler(async (req, res) => {
    const { phone, address, city, state, postalCode, country } = req.body;

    if ([phone, address, city, state, postalCode, country].some(field => !field)) {
        throw new ApiError(400, "All fields are required.");
    }

    const newAddress = await Address.create({
        user: req.user?._id,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
    });

    if (!newAddress) {
        throw new ApiError(500, "Failed to add new address.");
    }

    return res.status(201).json(
        new ApiResponse(
            201, 
            newAddress, 
            "Address added successfully."
        )
    );
});

// get logged in user address
const getLoggedInUserAddress = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const userAddress = await Address.find({ user: userId });

    if (!userAddress) {
        throw new ApiError(404, "User address not found.");
    }

    if (userAddress.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "User not added their address yet."
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userAddress,
                count: userAddress.length,
            },
            "User address fetched successfully."
        )
    );
});

// get address
const getUserAddress = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const userAddress = await Address.find({ user: userId });

    if (!userAddress) {
        throw new ApiError(404, "User address not found.");
    }

    if (userAddress.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "User not added their address yet."
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userAddress,
                count: userAddress.length,
            },
            "User address retrieved successfully."
        )
    );
});

// update address
const updateAddress = asyncHandler(async (req, res) => {
    const addressId = req.params.id;
    const { phone, address, city, state, postalCode, country } = req.body;

    if (!isValidObjectId(addressId)) {
        throw new ApiError(400, "Invalid address ID.");
    }

    const oldAddress = await Address.findById(addressId);

    if (!oldAddress) {
        throw new ApiError(404, "Address not found.");
    }

    if (oldAddress?.user?.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this address.");
    }

    oldAddress.phone = phone || oldAddress.phone;
    oldAddress.address = address || oldAddress.address;
    oldAddress.city = city || oldAddress.city;
    oldAddress.state = state || oldAddress.state;
    oldAddress.postalCode = postalCode || oldAddress.postalCode;
    oldAddress.country = country || oldAddress.country;

    const updatedAddress = await oldAddress.save();

    if (!updatedAddress) {
        throw new ApiError(500, "Failed to update address.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedAddress,
            "Address updated successfully."
        )
    );
});

// delete address
const deleteAddress = asyncHandler(async (req, res) => {
    const addressId = req.params.id;

    if (!isValidObjectId(addressId)) {
        throw new ApiError(400, "Invalid address ID.");
    }

    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found.");
    }

    if (address?.user?.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this address.");
    }

    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
        throw new ApiError(500, "Failed to delete address.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            deletedAddress,
            "Address deleted successfully.",
        )
    );
});

export {
    addAddress,
    getLoggedInUserAddress,
    getUserAddress,
    updateAddress,
    deleteAddress,
}