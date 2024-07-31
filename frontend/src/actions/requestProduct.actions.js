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

// place order
export const placeOrder = async (orderData) => {
    try {
        const { data } = await axios.post("/api/order/create-order", orderData);

        if (data?.data?.order) {
            return {
                message: data?.message,
                success: true,
                order: data?.data?.order,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            error: true,
        };
    }
}

// get user orders
export const getUserOrders = async () => {
    try {
        const { data } = await axios.get(`/api/order/get-user-orders`);

        if (data?.data?.orders) {
            return {
                orders: data?.data?.orders,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            error: true,
        };
    }
}

// get single orders
export const getSingleOrder = async (orderId) => {
    try {
        const { data } = await axios.get(`/api/order/get-single-order/${orderId}`);

        if (data?.data?.order) {
            return {
                order: data?.data?.order,
                success: true,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            error: true,
        };
    }
}

// make order payment
export const makeOrderPayment = async (paymentData) => {
    try {
        const { data } = await axios.post("/api/payment/process-payment", paymentData);

        if (data?.data?.newPayment) {
            return {
                message: data?.message,
                success: true,
                payment: data?.data?.newPayment,
            };
        }
    } catch (error) {
        return {
            message: error?.response?.data?.message,
            error: true,
        };
    }
}