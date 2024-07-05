import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Category } from '../models/category.model.js';

// create a new category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, parentCategory, isActive } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required.");
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        throw new ApiError(400, "Category already exists.");
    }

    if (parentCategory?.length > 0 && !isValidObjectId(parentCategory)) {
        throw new ApiError(400, "Invalid parent category ID.");
    }

    const newCategory = await Category.create({
        name,
        description,
        parentCategory: parentCategory ? parentCategory : null,
        isActive,
    });

    if (!newCategory) {
        throw new ApiError(500, "Failed to create category.");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { newCategory },
            "Category created successfully.",
        ),
    );
});

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).populate('parentCategory');

    if (!categories) {
        throw new ApiError(500, "Failed to fetch categories.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                categories,
                count: categories.length,
            },
            "Categories fetched successfully.",
        ),
    );
});

// get single category by its id
const getSingleCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID.");
    }

    const category = await Category.findById(id).populate('parentCategory');

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { category },
            "Category fetched successfully.",
        ),
    );
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const { name, description, parentCategory, isActive } = req.body;

    if (!isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid category ID.");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    const categoryName = await Category.find({ name });

    if (categoryName.length > 0 && categoryName[0]._id.toString() !== categoryId) {
        throw new ApiError(400, "Category name already exists.");
    }

    if (parentCategory && !isValidObjectId(parentCategory)) {
        throw new ApiError(400, "Invalid parent category ID.");
    }

    // If parentCategory is provided, check if it exists and validate it's not the same as the current category
    let parentCategoryDoc = null;
    if (parentCategory) {
        parentCategoryDoc = await Category.findById(parentCategory);
        if (!parentCategoryDoc) {
            throw new ApiError(400, "Parent category not found.");
        }

        if (parentCategoryDoc._id.toString() === categoryId) {
            throw new ApiError(400, "Cannot set a category as its own parent.");
        }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.parentCategory = parentCategory ? parentCategory : category.parentCategory;
    category.isActive = isActive || category.isActive;

    const updatedCategory = await category.save();

    if (!updatedCategory) {
        throw new ApiError(500, "Failed to update category.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedCategory,
            "Category updated successfully.",
        ),
    );
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    if (!isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid category ID.");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    if (category.isActive) {
        throw new ApiError(400, "Cannot delete an active category.");
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId, { isActive: false });

    return res.json(
        new ApiResponse(
            200,
            deletedCategory,
            "Category deleted successfully.",
        ),
    );
});

export {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}
