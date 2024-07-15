import { isValidObjectId } from 'mongoose';
import fs from 'fs';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/product.model.js';

// create a new product
const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, category, description, price, sellingPrice, discount, countInStock } = req.body;

    if ([name, brand, category, description, price, sellingPrice, discount, countInStock].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields must be provided.");
    }

    const images = req.files?.productImages;

    if (!images || images.length === 0) {
        throw new ApiError(400, "Product image is required.");
    }

    const imagePaths = images.map(file => file?.path);

    const formattedImagePaths = imagePaths?.map(imageUrl => {
        return imageUrl.replace(/\\/g, '/').replace('public/', '');
    }) || [];

    const newProduct = await Product.create({
        user: req.user?._id,
        name,
        brand,
        category,
        description,
        price,
        sellingPrice,
        discount,
        countInStock,
        images: formattedImagePaths,
    });
    return res.status(201).json(
        new ApiResponse(
            201,
            {newProduct},
            "Product created successfully.",
        )
    );
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
            $regex: req.query.keyword,
            $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { 
                products, 
                count: products.length,
                page, 
                pages: Math.ceil(count / pageSize)
            },
            "All products fetched successfully.",
        )
    );
});

// get single product by id
const getProductById = asyncHandler(async(req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { product },
            "Product fetched successfully.",
        )
    );
});

// update single product by id
const updateProductInfo = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const { name, brand, category, description, price, discount, rating, countInStock } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.rating = rating || product.rating;
    product.countInStock = countInStock || product.countInStock;

    const updatedProductInfo = await product.save();

    if (!updatedProductInfo) {
        throw new ApiError(500, "Failed to update product information.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { updatedProductInfo },
            "Product information updated successfully.",
        )
    );
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    const removeProductImages = product.images;

    removeProductImages.forEach(async (imagePath) => {
        try {
            fs.unlinkSync(imagePath);
        } catch (error) {
            throw new ApiError(500, "Failed to remove product images.");
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { product },
            "Product deleted successfully.",
        )
    );
});

// get top rated products
const getTopProducts = asyncHandler(async (req, res) => {
    const topProducts = await Product.find({ countInStock: { $gt: 0 } })
        .sort({ rating: -1 })
        .limit(10);     // sort: -1 (descending order)

    if (!topProducts) {
        throw new ApiError(500, "Failed to fetch top products.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { 
                topProducts,
                count: topProducts.length 
            },
            "Top rated products fetched successfully.",
        )
    );
});

// get products in stock
const getProductsInStock = asyncHandler(async (req, res) => {
    const productsInStock = await Product.find({ countInStock: { $gt: 0 } });

    if (!productsInStock) {
        throw new ApiError(500, "Failed to fetch products in stock.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { 
                productsInStock,
                count: productsInStock.length
            },
            "Products in stock fetched successfully.",
        )
    );
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductInfo,
    deleteProduct,
    getTopProducts,
    getProductsInStock,
}
