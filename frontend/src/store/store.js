import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    userReducer,
    addressReducer,
} from "../reducers/user.reducers.js";
import {
    categoryReducer,
    productReducer
} from "../reducers/product.reducers.js";
import {
    cartReducer
} from "../reducers/cart.reducers.js";

const reducer = combineReducers({
    user: userReducer,
    address: addressReducer,
    category: categoryReducer,
    products: productReducer,
    cart: cartReducer,
});

const store = configureStore({
    reducer,
});

export default store;