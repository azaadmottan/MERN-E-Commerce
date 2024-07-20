import {
    LOAD_CART_PRODUCT_REQUEST,
    LOAD_CART_PRODUCT_SUCCESS,
    LOAD_CART_PRODUCT_FAIL,
    ADD_PRODUCT_TO_CART_REQUEST,
    ADD_PRODUCT_TO_CART_SUCCESS,
    CLEAR_CART,
    FAIL_ADD_PRODUCT_TO_CART,
    REQUEST_REMOVE_PRODUCT_FROM_CART,
    SUCCESS_REMOVE_PRODUCT_FROM_CART,
    FAIL_REMOVE_PRODUCT_FROM_CART,
    UPDATE_PRODUCT_QUANTITY_REQUEST,
    UPDATE_PRODUCT_QUANTITY_SUCCESS,
    UPDATE_PRODUCT_QUANTITY_FAIL,
} from "../constants/cart.constants.js";

const initialCartState = {
    cartItems: [],
    loading: true,
    success: false,
    error: null,
}

export const cartReducer = (state = initialCartState, { type, payload }) => {
    switch (type) {
        case LOAD_CART_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };
        case LOAD_CART_PRODUCT_SUCCESS:
            return {
                ...state,
                cartItems: payload,
                loading: false,
                success: true,
                error: null,
            };
        case LOAD_CART_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: payload,
            };
        case ADD_PRODUCT_TO_CART_REQUEST:
        case REQUEST_REMOVE_PRODUCT_FROM_CART:
            // const item = payload;
            // const existingItem = state.cartItems.find((x) => x.product._id === item._id);
            // if (existingItem) {
            //     existingItem.quantity += item.quantity;
            // } else {
            //     state.cartItems.push(item);
            // }
            return {
                cartItems: [...state.cartItems],
                loading: false,
                success: true,
                error: null,
            };
        case ADD_PRODUCT_TO_CART_SUCCESS:
            return {
                cartItems: payload,
                loading: false,
                success: true,
                error: null,
            };
        case SUCCESS_REMOVE_PRODUCT_FROM_CART:
            return {
                cartItems: state.cartItems.filter((x) => x?.product?._id !== payload),
                loading: false,
                success: true,
                error: null,
            };
        case FAIL_ADD_PRODUCT_TO_CART:
        case FAIL_REMOVE_PRODUCT_FROM_CART:
            return {
                cartItems: [...state.cartItems],
                loading: false,
                success: false,
                error: payload,
            };
        case UPDATE_PRODUCT_QUANTITY_SUCCESS:
            return {
                cartItems: state.cartItems.map((x) =>
                    x.product._id === payload.productId ? {...x, quantity: payload.quantity } : x
                ),
                loading: false,
                success: true,
                error: null,
            };
        case UPDATE_PRODUCT_QUANTITY_FAIL:
            return {
                cartItems: [...state.cartItems],
                loading: false,
                success: false,
                error: payload,
            };
        case CLEAR_CART:
            return {
                cartItems: [],
                loading: false,
                success: true,
                error: null,
            };
        default:
            return state;
    }
}