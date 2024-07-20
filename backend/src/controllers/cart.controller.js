import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
    
    if (!cart) {
        throw new ApiError(404, 'Cart not found. Create a new cart.');
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                cart,
                count: cart.cartItems.length,
            },
            'User cart fetched successfully.'
        )
    );
});

// add product to cart
const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, 'Invalid product ID.');
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Product not found.');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, cartItems: [] });
    }

    let existingCartItems = cart?.cartItems?.find(item => item.product.toString() === productId);

    if (existingCartItems) {
        existingCartItems.quantity += quantity;
    }
    else {
        cart.cartItems.push({ product: productId, quantity });
    }

    const cartProducts = await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate('cartItems.product');

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                cart: updatedCart,
                count: updatedCart.cartItems.length,
            },
            'Product added to cart successfully.'
        )
    );
});

// remove product from cart
const removeProductFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, 'Invalid product ID.');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found.');
    }

    const existingCartItems = cart?.cartItems?.findIndex(item => item.product.toString() === productId);

    if (existingCartItems === -1) {
        throw new ApiError(404, 'Product not found in cart.');
    }

    cart.cartItems.splice(existingCartItems, 1);

    const updatedCartItems = await cart.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                productId,
                message: "Cart updated successfully"
            },
            'Product removed from cart successfully.'
        )
    );
});

// update product quantity in cart
const updateProductQuantity = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, 'Invalid product ID.');
    }

    if (!quantity) {
        throw new ApiError(400, 'Product quantity is required.');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found.');
    }

    const existingCartItems = cart?.cartItems?.findIndex(item => item.product.toString() === productId);

    if (existingCartItems === -1) {
        throw new ApiError(404, 'Product not found in cart.');
    }

    cart.cartItems[existingCartItems].quantity = quantity;

    const updatedCartItems = await cart.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                updatedCartItems,
                count: updatedCartItems.cartItems.length
            },
            'Product quantity updated successfully.'
        )
    );
});

// clear user cart
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found.');
    }

    cart.cartItems = [];

    await cart.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                cart,
                count: cart.cartItems.length
            },
            "Cart cleared successfully."
        )
    );
});


export {
    getUserCart,
    addToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart
}