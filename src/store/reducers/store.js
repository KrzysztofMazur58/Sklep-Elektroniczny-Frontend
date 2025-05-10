import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { errorReducer } from "./errorReducer";
import { cartReducer } from "./cartReducer";

const cartItems = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : [];

const user = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const initialState = {
    auth: {user: user},
    carts: { cart: cartItems },
};


export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        carts: cartReducer,
        auth: authReducer,
    },
    preloadedState: initialState,
});

export default store;