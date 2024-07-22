import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Product } from '../models/product.model.js';

// search products
const searchProduct = asyncHandler(async (req, res) => {
    const pageSize = 23;
    const page = Number(req?.query?.p) || 1;

    if (!req?.query?.q) {
        throw new ApiError(400, "Query keywords must be provided.");
    }

    const keyword = {
        $or: [
            { name: { $regex: req.query.q, $options: 'i' } },
            { brand: { $regex: req.query.q, $options: 'i' } },
            { category: { $regex: req.query.q, $options: 'i' } }
        ]
    };

    const count = await Product.countDocuments(keyword);
    const products = await Product.find(keyword)
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
            "Products fetched successfully.",
        )
    );
});

export {
    searchProduct,
}