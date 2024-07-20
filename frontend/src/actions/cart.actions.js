import axios from "axios";
import {
    LOAD_CART_PRODUCT_REQUEST,
    LOAD_CART_PRODUCT_SUCCESS,
    LOAD_CART_PRODUCT_FAIL,
    ADD_PRODUCT_TO_CART_REQUEST,
    ADD_PRODUCT_TO_CART_SUCCESS,
    FAIL_ADD_PRODUCT_TO_CART,
    REQUEST_REMOVE_PRODUCT_FROM_CART,
    SUCCESS_REMOVE_PRODUCT_FROM_CART,
    FAIL_REMOVE_PRODUCT_FROM_CART,
    UPDATE_PRODUCT_QUANTITY_SUCCESS,
    UPDATE_PRODUCT_QUANTITY_FAIL,
} from "../constants/cart.constants.js";

// load user cart products
export const loadUserCartProducts = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_CART_PRODUCT_REQUEST });

        const { data } = await axios.get(`/api/cart/user-cart`);

        dispatch({
            type: LOAD_CART_PRODUCT_SUCCESS,
            payload: data?.data?.cart?.cartItems,
        });
    } catch (error) {
        dispatch({
            type: LOAD_CART_PRODUCT_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// add product to cart
export const addProductToCart = (productId, quantity=1) => async (dispatch) => {
    try {
        dispatch({ type: ADD_PRODUCT_TO_CART_REQUEST });

        const { data } = await axios.post(
            `/api/cart/add-to-cart`,
            { productId, quantity }
        );

        dispatch({
            type: ADD_PRODUCT_TO_CART_SUCCESS,
            payload: data?.data?.cart?.cartItems,
        });
    } catch (error) {
        dispatch({
            type: FAIL_ADD_PRODUCT_TO_CART,
            payload: error?.response?.data?.message,
        })
    }
}

// remove product from cart
export const removeProductFromCart = (productId) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_REMOVE_PRODUCT_FROM_CART });

        const { data } = await axios.delete(
            `/api/cart/remove-product-from-cart`,
            { 
                data: { productId }
            }
        );
        
        dispatch({
            type: SUCCESS_REMOVE_PRODUCT_FROM_CART,
            payload: productId,
        });
    } catch (error) {
        dispatch({
            type: FAIL_REMOVE_PRODUCT_FROM_CART,
            payload: error?.response?.data?.message,
        });
    }
}

// update product quantity in cart
export const updateProductQuantity = (productId, quantity) => async (dispatch) => {
    try {
        const { data } = await axios.post(
            `/api/cart/update-product-quantity`,
            { productId, quantity }
        );
        dispatch({
            type: UPDATE_PRODUCT_QUANTITY_SUCCESS,
            payload: { productId, quantity },
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_QUANTITY_FAIL,
            payload: error?.response?.data?.message,
        })
    }
}

