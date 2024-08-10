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

// get order information
export const getOrderInfo = async (orderId) => {
    try {
        const { data } = await axios.get(`/api/order/get-order-info/${orderId}`);

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

// get all orders
export const getAllOrders = async () => {
    try {
        const { data } = await axios.get(`/api/order/get-all-orders`);

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

// update order status
export const updateOrderStatus = async (orderId, status, deliveredAt="") => {
    try {
        const { data } = await axios.post(`/api/order/update-order-status/${orderId}`,
            { status, deliveredAt }
        );

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

// get all payments
export const getAllPayments = async () => {
    try {
        const { data } = await axios.post(`/api/payment/get-all-payments`);

        if (data?.data?.payments) {
            return {
                payments: data?.data?.payments,
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

// get single payment
export const getSinglePayment = async (paymentId) => {
    try {
        const { data } = await axios.post(`/api/payment/get-single-payment/${paymentId}`);
        if (data?.data?.payment) {
            return {
                payment: data?.data?.payment,
                upiDetails: data?.data?.userUpiDetails,
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

// create wallet
export const createWallet = async (upiId, upiPassword) => {
    try {
        const { data } = await axios.post(`/api/wallet/create-wallet`,
            { upiId, upiPassword }
        );

        if (data?.data?.userWallet) {
            return {
                wallet: data?.data?.userWallet,
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

// get user wallet
export const getUserWallet = async () => {
    try {
        const { data } = await axios.get(`/api/wallet/get-wallet`);
        if (data?.data?.wallet) {
            return {
                wallet: data?.data?.wallet,
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

// create transaction
export const createTransaction = async (senderUpiId, receiverUpiId, amount, description, upiPassword, paymentStatus) => {
    try {
        const { data } = await axios.post(`/api/wallet/create-transaction`,
            { senderUpiId, receiverUpiId, amount, description, upiPassword, paymentStatus }
        );

        if (data?.data?.newTransaction) {
            return {
                transaction: data?.data?.newTransaction,
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