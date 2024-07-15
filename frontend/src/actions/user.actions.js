import axios from "axios";
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
    ADD_ADDRESS_REQUEST,
    ADD_ADDRESS_FAIL,
    ADD_ADDRESS_SUCCESS,
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
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAIL,
    DELETE_ADDRESS_FAIL,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
} from "../constants/user.constants.js";

// Login User
export const loginUser = (userData) => async (dispatch) => {
    try {
        const { userName, email, password } = userData;

        dispatch({ type: LOGIN_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.post(
            '/api/users/login',
            { userName, email, password },
            config
        );

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data?.data?.user,
        });
    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error.response?.data?.message,
        });
    }
}

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        const { userName, fullName, email, password, profilePicture } = userData;

        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            '/api/users/register',
            { userName, fullName, email, password, profilePicture },
            config
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data?.data?.user,
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get('/api/users/current-user');

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data?.data?.user,
        });
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.post('/api/users/logout');

        dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Load User Address
export const loadUserAddress = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_ADDRESS_REQUEST });

        const { data } = await axios.get(`/api/address/login-user-address`);

        dispatch({
            type: LOAD_ADDRESS_SUCCESS,
            payload: data?.data?.userAddress,
        });
    } catch (error) {
        dispatch({
            type: LOAD_ADDRESS_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Add New User Address
export const addNewUserAddress = (addressData) => async (dispatch) => {
    try {
        const { phone, country, address, state, city, postalCode } = addressData;

        dispatch({ type: ADD_ADDRESS_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.post(
            '/api/address/add-address',
            { phone, country, address, state, city, postalCode },
            config
        );

        dispatch({
            type: ADD_ADDRESS_SUCCESS,
            payload: data?.data,
        });

        dispatch(loadUserAddress());
    } catch (error) {
        dispatch({
            ADD_ADDRESS_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// Update User Address
export const updateUserAddress = (addressData) => async (dispatch) => {
    try {
        const { _id, phone, country, address, state, city, postalCode } = addressData;

        dispatch({ type: UPDATE_ADDRESS_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.post(
            `/api/address/update-address/${_id}`,
            { phone, country, address, state, city, postalCode },
            config
        );

        dispatch({
            type: UPDATE_ADDRESS_SUCCESS,
            payload: data?.data,
        });

        dispatch(loadUserAddress());
    } catch (error) {
        dispatch({
            type: UPDATE_ADDRESS_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// Delete User Address
export const deleteUserAddress = (_id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ADDRESS_REQUEST });

        const { data } = await axios.delete(`/api/address/delete-address/${_id}`);

        dispatch({
            type: DELETE_ADDRESS_SUCCESS,
        });

        dispatch(loadUserAddress());
    } catch (error) {
        dispatch({
            type: DELETE_ADDRESS_FAIL,
            payload: error?.response?.data?.message,
        });
    }
}

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};