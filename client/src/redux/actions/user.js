import axios from "axios";
import { server } from "../../server";

// load user
export const loaduser = () => async (dispatch) => {
  try {
    // means execute this reducer
    dispatch({
      type: "LoadUserRequest"
    });

    // fecth data for action payload
    // (load user req get hit here which is declare after login in controller in user)
    // withCred:true (to save the cookies(in which our token get store))
    const { data } = await axios.get(`${server}/user/getuser`, { withCredentials: true });

    dispatch({
      type: "LoadUserSuccess",
      // payload me user ko store krdo
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response.data.message
    });
  }
}

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

// update user address
export const updatUserAddress =
  (country, state, city, address1, address2, zipCode, addressType) =>
    async (dispatch) => {
      try {
        dispatch({
          type: "updateUserAddressRequest",
        });

        const { data } = await axios.put(
          `${server}/user/update-user-addresses`,
          {
            country,
            state,
            city,
            address1,
            address2,
            zipCode,
            addressType,
          },
          { withCredentials: true }
        );

        dispatch({
          type: "updateUserAddressSuccess",
          payload: {
            successMessage: "User address updated succesfully!",
            user: data.user,
          },
        });
      } catch (error) {
        dispatch({
          type: "updateUserAddressFailed",
          payload: error.response.data.message,
        });
      }
    };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};