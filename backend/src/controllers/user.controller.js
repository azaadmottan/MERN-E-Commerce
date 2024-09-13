import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { User } from '../models/user.model.js';
import { isValidObjectId } from 'mongoose';

// generate refresh and access tokens.

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens.", [{ error: error }]);
    }
};

// register user
const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body;

    if ([userName, fullName, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required.");
    }

    const userNameExists = await User.findOne({ userName });

    if (userNameExists) {
        throw new ApiError(409, "Username is already exists.", [{ 
            userName,
            message: "This username is already taken by other user. Please provide different username." 
        }]);
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new ApiError(409, "Email is already exists.", [{
            email, 
            message: "This email address already taken by other user. Please provide different email address." 
        }]);
    }

    const profilePicture = req.files?.profilePicture?.[0]?.path;

    if (!profilePicture) {
        throw new ApiError(500, "Profile picture is required.");
    }

    const formattedPath = profilePicture.replace(/\\/g, '/').replace('public/', '');

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        profilePicture: formattedPath,
        isAdmin: false,
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering a new user.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(userCreated._id);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(        
        new ApiResponse(200, {user: userCreated}, "User registered successfully.")
    );
});

// login user
const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "Username or email is required.");
    }

    if (!password) {
        throw new ApiError(400, "Password is required.");
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while logging a user.");
    }

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, 
                accessToken, 
                refreshToken
            }, 
            "User logged in successfully."
        )
    );
});

// logout user
const logoutUser = asyncHandler(async(req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, {}, "User logged out successfully."
        )
    );
});

// refresh access token
const refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request.", [{
            message: "To refresh the access token first login required."
        }]);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token.");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token has been expired.");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        user.refreshToken = refreshToken;
        const updatedToken = await user.save();

        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json (new ApiResponse(
                200, 
                { accessToken, refreshToken: refreshToken },
                "Access token refreshed successfully."
        ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token.");
    }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!oldPassword) {
        throw new ApiError(400, "Old password is required.");
    }

    if (!newPassword) {
        throw new ApiError(400, "New password is required.");
    }

    const isPasswordValid = await user.matchPassword(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }
    
    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                success: true,
            },
            "Password updated successfully."
        )
    );
});

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: user
            },
            "Current logged in user fetched successfully."
        )
    );
});

// update user role
const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    if (!role) {
        throw new ApiError(400, "Role is required.");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            isAdmin: role
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(500, "Failed to update user role.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {user},
            "User role updated successfully."
        )
    );
});

// update user account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields must be provided.");
    }

    const existingEmail = await User.findOne({ email }).select("-password -refreshToken");

    if (existingEmail && existingEmail._id.toString()!== req.user?._id.toString()) {
        throw new ApiError(409, "Email is already taken by other user.");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            fullName,
            email
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(500, "Failed to update user account details.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { user },
            "User account details updated successfully."
        )
    );
});

// update user profile picture
const updateProfilePicture = asyncHandler(async (req, res) => {
    const profilePicture = req.files?.profilePicture?.[0]?.path;

    if (!profilePicture) {
        throw new ApiError(500, "Profile picture is required.");
    }

    const oldProfilePicture = await User.findById(req.user?._id).select('profilePicture');

    // if (!oldProfilePicture.profilePicture) {
    //     throw new ApiError(500, "User has no profile picture.");
    // }

    if (oldProfilePicture?.profilePicture) {
        const removeProfile = fs.unlinkSync("public/" + oldProfilePicture?.profilePicture);
    }

    const formattedPath = profilePicture.replace(/\\/g, '/').replace('public/', '');

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            profilePicture: formattedPath,
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(500, "Failed to update user profile picture.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User profile picture updated successfully."
        )
    );
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    if (!users) {
        throw new ApiError(500, "Failed to fetch all users.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
            },
            "All users fetched successfully."
        )
    );
});

// get user by id
const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
            },
            "User fetched successfully."
        )
    );
});

// update account activity status
const updateAccountActivityStatus = asyncHandler(async (req, res) => {
    const { userId, isActive } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid ID.");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            isActive
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(500, "Failed to update account activity status.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {user},
            "Account activity status updated successfully."
        )
    );
});

// delete account
const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(500, "Failed to delete account.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Account deleted successfully."
        )
    );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    updatePassword,
    getCurrentUser,
    updateUserRole,
    updateAccountDetails,
    updateProfilePicture,
    getAllUsers,
    getUserById,
    updateAccountActivityStatus,
}