import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_ADDRESS_REQUEST,
    LOAD_ADDRESS_SUCCESS,
    LOAD_ADDRESS_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    ALL_USERS_FAIL,
    ALL_USERS_SUCCESS,
    ALL_USERS_REQUEST,
    ADD_ADDRESS_REQUEST,
    ADD_ADDRESS_SUCCESS,
    ADD_ADDRESS_FAIL,
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAIL,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
    DELETE_ADDRESS_FAIL,
} from "../constants/user.constants.js";

const initialUserState = {
    user: null,
    loading: true,
    success: false,
    error: null
}

export const userReducer = (state = initialUserState, { type, payload }) => {
    switch (type) {
        case LOGIN_USER_REQUEST:
        case REGISTER_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            };
        case LOGIN_USER_SUCCESS:
        case REGISTER_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: payload,
            };
        case LOGOUT_USER_SUCCESS:
            return {
                loading: false,
                user: null,
                isAuthenticated: false,
            };
        case LOGIN_USER_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            };
        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            }
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

const initialAddressState = {
    address: null,
    loading: true,
    success: false,
    error: null
}

export const addressReducer = (state = initialAddressState, { type, payload }) => {
    switch (type) {
        case LOAD_ADDRESS_REQUEST:
        case ADD_ADDRESS_REQUEST:
        case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case LOAD_ADDRESS_SUCCESS:
        case ADD_ADDRESS_SUCCESS:
        case UPDATE_ADDRESS_SUCCESS:
        case DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                address: payload,
                loading: false,
                error: null,
            }
        case LOAD_ADDRESS_FAIL:
        case ADD_ADDRESS_FAIL:
        case UPDATE_ADDRESS_FAIL:
        case DELETE_ADDRESS_FAIL:
            return {
                loading: false,
                error: payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};