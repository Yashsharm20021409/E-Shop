import { createReducer } from "@reduxjs/toolkit"

const initialState = {
    cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
}

export const cartReducer = createReducer(initialState, {
    addToCart: (state, action) => {
        // item store product
        const item = action.payload;
        // check if product already exists in cart if have then update the item in cart {else} send the item into  the cart
        const isItemExist = state.cart.find((i) => i._id === item._id);

        if (isItemExist) {
            return {
                ...state,
                cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i)),
            };
        } else {
            return {
                ...state,
                cart: [...state.cart, item],
            };
        }
    },

    removeFromCart: (state, action) => {
        return {
            ...state,
            // means show only those whose id is not equal to remove item id and then that item get removed by filter method
            cart: state.cart.filter((i) => i._id !== action.payload),
        };
    },
});