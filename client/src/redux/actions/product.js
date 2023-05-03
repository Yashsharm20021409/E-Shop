import axios from "axios";
import { server } from "../../server";

// create-product
export const createProduct = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "productCreateRequest",
        });


        // use this because our data type is form data here
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        // data <-- get in res from server for payload in redux and then user anywhere in frontend
        const { data } = await axios.post(
            `${server}/product/create-product`,
            newForm,
            config
        );
        dispatch({
            type: "productCreateSuccess",
            payload: data.product,
        });
    } catch (error) {
        dispatch({
            type: "productCreateFail",
            payload: error.response.data.message,
        });
    }
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsShopRequest",
        });

        const { data } = await axios.get(
            `${server}/product/get-all-shop-products/${id}`
        );

        dispatch({
            type: "getAllProductsShopSuccess",
            payload: data.products,
        });

    } catch (error) {
        dispatch({
            type: "getAllProductsShopFailed",
            payload: error.response.data.message,
        });
    }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteProductRequest",
        });
        
        // with cred : true is imp here bcoz in server side we check isSeller is true or not
        const { data } = await axios.delete(
            `${server}/product/delete-shop-product/${id}`,
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: "deleteProductSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteProductFailed",
            payload: error.response.data.message,
        });
    }
};
