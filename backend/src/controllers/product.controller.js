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

// add additional attributes
const additionalProductInfo = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const additionalData = req.body.data;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    if (!additionalData || additionalData.length === 0) {
        throw new ApiError(400, "Additional data must be provided.");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { 
            $set: {
                attributes: additionalData
            }
        },
        { new: true },
    );

    if (!updatedProduct) {
        throw new ApiError(500, "Failed to add product additional information.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { updatedProduct },
            "Product additional information added successfully.",
        )
    );
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const pageSize = 15;
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

// get category wise products
const getCategoryWiseProducts = asyncHandler(async (req, res) => {
    const { categoryKeyword } = req.params;

    if (!categoryKeyword || categoryKeyword.trim() === "") {
        throw new ApiError(400, "Category keywords is required.");
    }

    const keyword = {
        category: {
            $regex: categoryKeyword,
            $options: 'i',
        } 
    }

    const categoryProducts = await Product.find({ ...keyword });

    if (!categoryProducts || categoryProducts.length === 0) {
        throw new ApiError(404, "No product found in this category.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { categoryProducts },
            "Products fetched successfully in this category.",
        )
    );
});

// update single product by id
const updateProductInfo = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const { name, brand, category, description, price, sellingPrice, discount, rating, countInStock } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.sellingPrice = sellingPrice || product.sellingPrice;
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

// update product images
const addNewProductImages = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    const images = req.files?.productImages;

    if (!images || images.length === 0) {
        throw new ApiError(400, "Product image is required.");
    }

    const imagePaths = images.map(file => file?.path);

    const formattedImagePaths = imagePaths?.map(imageUrl => {
        return imageUrl.replace(/\\/g, '/').replace('public/', '');
    }) || [];

    // if (formattedImagePaths && product?.images) {
    //     product?.images?.map(imageUrl => {
    //         fs.unlinkSync("public/" + imageUrl);
    //     })
    // }

    product.images = [...product?.images, ...formattedImagePaths];

    const updatedProduct = await product.save();

    if (!updatedProduct) {
        throw new ApiError(500, "Failed to add product images.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { updatedProduct },
            "Product images added successfully.",
        )
    );
});

const removeProductImage = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    const { imagePath } = req.body;

    if (!imagePath) {
        throw new ApiError(400, "Image path is required.");
    }

    fs.unlinkSync("public/" + imagePath);

    // Remove the image path from the product's images array
    product.images = product?.images?.filter(image => image !== imagePath);

    const updatedProduct = product.save();

    if (!updatedProduct) {
        throw new ApiError(500, "Failed to remove product image.");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { updatedProduct },
            "Product image removed successfully.",
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
    additionalProductInfo,
    getAllProducts,
    getProductById,
    getCategoryWiseProducts,
    updateProductInfo,
    addNewProductImages,
    removeProductImage,
    deleteProduct,
    getTopProducts,
    getProductsInStock,
}
