// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
    dispatch({
        type: "addToCart",
        // data is here product data which store in payload after clicking in addToCart button
        payload: data,
    });

    // cartItem is name of collection in local storage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
    dispatch({
        type: "removeFromCart",
        payload: data._id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
};