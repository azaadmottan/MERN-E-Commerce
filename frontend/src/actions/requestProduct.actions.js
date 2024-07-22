import axios from "axios";

// get product by its id
export const getProductById = async (id) => {
    try {
        const { data } = await axios.get(`/api/products/get-product/${id}`);

        if (data?.data?.product) {
            return {
                product: data?.data?.product,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}

// get category wise products
export const categoryProducts = async (categoryKeyword) => {
    try {
        const { data } = await axios.get(`/api/products/get-category-products/${categoryKeyword}`);

        if (data?.data?.categoryProducts) {
            return {
                products: data?.data?.categoryProducts,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}

// get category with its products
export const getCategory = async (id) => {
    try {
        const { data } = await axios.get(`/api/category/get-category/${id}`);
        if (data?.data?.category) {
            return {
                category: data?.data?.category,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}

// get product reviews
export const getProductReview = async (id) => {
    try {
        const { data } = await axios.get(`/api/reviews/product-reviews/${id}`);

        if (data?.data?.reviews) {
            return {
                reviews: data?.data?.reviews,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}

// create product review
export const createProductReview = async (id, reviewData) => {
    try {
        const { data } = await axios.post(
            `/api/reviews/create-review/${id}`,
            reviewData
        );

        if (data?.data?.createdAt) {
            return {
                message: data?.message,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}

// search for products
export const searchProducts = async (query) => {
    try {
        const { data } = await axios.get(`/api/search/search-products?q=${query}`);

        if (data?.data?.products) {
            return {
                products: data?.data?.products,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            success: false,
        };
    }
}