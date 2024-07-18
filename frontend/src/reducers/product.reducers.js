import {
    LOAD_CATEGORY_REQUEST,
    LOAD_CATEGORY_SUCCESS,
    LOAD_CATEGORY_FAIL,
    ADD_NEW_CATEGORY_REQUEST,
    ADD_NEW_CATEGORY_SUCCESS,
    ADD_NEW_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    CLEAR_ERRORS,
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
    DELETE_PRODUCT_FAIL,
    ADD_PRODUCT_ATTRIBUTES_REQUEST,
    ADD_PRODUCT_ATTRIBUTES_SUCCESS,
    ADD_PRODUCT_ATTRIBUTES_FAIL,
} from "../constants/product.constant.js";

const initialCategoryState = {
    category: [],
    loading: true,
    error: null,
};

export const categoryReducer = (state = initialCategoryState, { type, payload }) => {
    switch (type) {
        case LOAD_CATEGORY_REQUEST:
        case ADD_NEW_CATEGORY_REQUEST:
        case UPDATE_CATEGORY_REQUEST:
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null
            };
        case LOAD_CATEGORY_SUCCESS:
        case ADD_NEW_CATEGORY_SUCCESS:
        case UPDATE_CATEGORY_SUCCESS:
        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category: payload,
                success: true,
            };
        case LOAD_CATEGORY_FAIL:
        case ADD_NEW_CATEGORY_FAIL:
        case UPDATE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                success: false,
            };
        case DELETE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                success: false,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                success: false,
            };
        default:
            return state;
    }
};

const initialProductState = {
    products: [],
    loading: true,
    error: null,
};

export const productReducer = (state = initialProductState, { type, payload }) => {
    switch (type) {
        case LOAD_PRODUCT_REQUEST:
        case ADD_NEW_PRODUCT_REQUEST:
        case ADD_PRODUCT_ATTRIBUTES_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null
            };
        case LOAD_PRODUCT_SUCCESS:
        case ADD_NEW_PRODUCT_SUCCESS:
        case ADD_PRODUCT_ATTRIBUTES_SUCCESS:
        case UPDATE_PRODUCT_SUCCESS:
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: payload,
                success: true,
            };
        case LOAD_PRODUCT_FAIL:
        case ADD_NEW_PRODUCT_FAIL:
        case ADD_PRODUCT_ATTRIBUTES_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                success: false,
            };
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                success: false,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                success: false,
            };
        default:
            return state;
    }
}