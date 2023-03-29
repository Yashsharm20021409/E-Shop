import axios from "axios";
import { server } from "../../server";

// load user
export const loaduser = () => async(dispatch)=>{
    try {
        // means execute this reducer
        dispatch({
            type:"LoadUserRequest"
        });

        // fecth data for action payload
        // (load user req get hit here which is declare after login in controller in user)
        // withCred:true (to save the cookies(in which our token get store))
        const {data} = await axios.get(`${server}/user/getuser`,{withCredentials:true});

        dispatch({
            type:"LoadUserSuccess",
            // payload me user ko store krdo
            payload:data.user,
        });
    } catch (error) {
        dispatch({
            type:"LoadUserFailure",
            payload:error.response.data.message
        });
    }
}