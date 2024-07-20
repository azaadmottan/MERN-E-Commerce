import axios from "axios";
import {
    LOAD_CATEGORY_REQUEST,
    LOAD_CATEGORY_SUCCESS,
    LOAD_CATEGORY_FAIL,
    ADD_NEW_CATEGORY_REQUEST,
    ADD_NEW_CATEGORY_SUCCESS,
    ADD_NEW_CATEGORY_FAIL,
    CLEAR_ERRORS,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAIL,
    LOAD_PRODUCT_REQUEST,
    LOAD_PRODUCT_SUCCESS,
    LOAD_PRODUCT_FAIL,
    ADD_NEW_PRODUCT_REQUEST,
    ADD_NEW_PRODUCT_SUCCESS,
    ADD_NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    ADD_NEW_PRODUCT_IMAGE_REQUEST,
    ADD_NEW_PRODUCT_IMAGE_SUCCESS,
    ADD_NEW_PRODUCT_IMAGE_FAIL,
    REMOVE_PRODUCT_IMAGE_REQUEST,
    REMOVE_PRODUCT_IMAGE_SUCCESS,
    REMOVE_PRODUCT_IMAGE_FAIL,
    ADD_PRODUCT_ATTRIBUTES_REQUEST,
    ADD_PRODUCT_ATTRIBUTES_SUCCESS,
    ADD_PRODUCT_ATTRIBUTES_FAIL,
} from "../constants/product.constant.js";

// category actions
// load all the categories
export const loadCategories = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_CATEGORY_REQUEST });

        const { data } = await axios.get("/api/category/all-categories");

        dispatch({
            type: LOAD_CATEGORY_SUCCESS,
            payload: data?.data?.categories,
        });
    } catch (error) {
        dispatch({
            type: LOAD_CATEGORY_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// add new category
export const addNewCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_NEW_CATEGORY_REQUEST });

        const { name, description, isActive, categoryImage } = categoryData;

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            '/api/category/create-category',
            { name, description, isActive, categoryImage },
            config
        );

        dispatch({
            type: ADD_NEW_CATEGORY_SUCCESS,
            payload: data?.data?.data,
        });

        dispatch(loadCategories());
    } catch (error) {
        dispatch({
            type: ADD_NEW_CATEGORY_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// update category
export const updateCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CATEGORY_REQUEST });

        const { _id, name, description, isActive, categoryImage } = categoryData;

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            `/api/category/update-category/${_id}`,
            { name, description, isActive, categoryImage },
            config
        );

        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data?.data?.data,
        });

        dispatch(loadCategories());
    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// delete category
export const deleteCategory = (_id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CATEGORY_REQUEST });

        const { data } = await axios.delete(`/api/category/delete-category/${_id}`);

        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
        });

        dispatch(loadCategories());
    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// product actions
// load products
export const loadProducts = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_PRODUCT_REQUEST });

        const { data } = await axios.get("/api/products/all-products");

        dispatch({
            type: LOAD_PRODUCT_SUCCESS,
            payload: data?.data?.products,
        });
    } catch (error) {
        dispatch({
            type: LOAD_PRODUCT_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// add new product
export const addNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_NEW_PRODUCT_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            '/api/products/create-product',
            productData,
            config
        );

        dispatch({
            type: ADD_NEW_PRODUCT_SUCCESS,
            payload: data?.data?.newProduct,
        });

        dispatch(loadProducts());
    } catch (error) {
        dispatch({
            type: ADD_NEW_PRODUCT_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// add additional product information
export const addAdditionalProductInfo = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_PRODUCT_ATTRIBUTES_REQUEST });

        const { data } = await axios.post(
            `/api/products/add-product-additional-info/${id}`,
            productData
        );

        dispatch({
            type: ADD_PRODUCT_ATTRIBUTES_SUCCESS,
            payload: data?.data?.updatedProduct,
        });

        dispatch(loadProducts());
    } catch (error) {
        dispatch({
            type: ADD_PRODUCT_ATTRIBUTES_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// update product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            `/api/products/update-product-info/${id}`,
            productData,
            // config
        );

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data?.data?.updatedProductInfo,
        });

        dispatch(loadProducts());
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// add new images
export const addNewProductImages = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_NEW_PRODUCT_IMAGE_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            `/api/products/add-product-images/${id}`,
            productData,
            config
        );

        dispatch({
            type: ADD_NEW_PRODUCT_IMAGE_SUCCESS,
            payload: data?.data?.updatedProduct,
        });

        dispatch(loadProducts());
    } catch (error) {
        dispatch({
            type: ADD_NEW_PRODUCT_IMAGE_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// remove image
export const removeProductImage = (id, imagePath) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_PRODUCT_IMAGE_REQUEST });

        const { data } = await axios.post(
            `/api/products/remove-product-image/${id}`,
            imagePath
        );

        dispatch({
            type: REMOVE_PRODUCT_IMAGE_SUCCESS,
            payload: data?.data?.updatedProduct,
        });

        dispatch(loadProducts());
    } catch (error) {
        dispatch({
            type: REMOVE_PRODUCT_IMAGE_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
