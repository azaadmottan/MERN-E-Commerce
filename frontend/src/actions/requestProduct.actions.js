import axios from "axios";

// get all users
export const getAllUsers = async () => {
    try {
        const { data } = await axios.get("/api/users/get-all-users");

        if (data?.data?.users) {
            return {
                users: data?.data?.users,
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

// get single user
export const getUserById = async (id) => {
    try {
        const { data } = await axios.get(`/api/users/get-single-user/${id}`);
        if (data?.data?.user) {
            return {
                user: data?.data?.user,
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

// update account activity status
export const updateAccountActivity = async (userId, isActive) => {
    try {
        const { data } = await axios.post(`/api/users/update-account-activity`, 
            { userId, isActive }
        );

        if (data?.data?.user) {
            return {
                user: data?.data?.user,
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

// get admin products
export const getAdminProducts = async () => {
    try {
        const { data } = await axios.get(`/api/products/get-admin-products`);

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

// get admin categories
export const getAdminCategories = async () => {
    try {
        const { data } = await axios.get(`/api/category/all-categories`);

        if (data?.data?.categories) {
            return {
                categories: data?.data?.categories,
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
            const cartData = await axios.delete("/api/cart/clear-cart");
            return {
                message: data?.message,
                success: true,
                order: data?.data?.order,
                cart: cartData?.data?.cart,
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

// get all coupons
export const getAllCoupons = async () => {
    try {
        const { data } = await axios.get(`/api/coupons/all-coupons`);

        if (data?.data?.coupons) {
            return {
                coupons: data?.data?.coupons,
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

// get active coupons
export const getActiveCoupons = async () => {
    try {
        const { data } = await axios.get(`/api/coupons/active-coupons`);

        if (data?.data?.activeCoupons) {
            return {
                coupons: data?.data?.activeCoupons,
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

// create coupon
export const createCoupon = async (code, discountType, discountValue, noOfItems, expiryDate) => {
    try {
        const { data } = await axios.post(`/api/coupons/create-coupon`,
            { code, discountType, discountValue, noOfItems, expiryDate }
        );

        if (data?.data?.newCoupon) {
            return {
                coupon: data?.data?.newCoupon,
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

// update coupon details
export const updateCoupon = async (couponId, code, discountType, discountValue, expiryDate) => {
    try {
        const { data } = await axios.post(`/api/coupons/update-coupon/${couponId}`,
            { code, discountType, discountValue, expiryDate }
        );

        if (data?.data?.updatedCoupon) {
            return {
                coupon: data?.data?.updatedCoupon,
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