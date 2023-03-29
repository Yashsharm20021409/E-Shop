import { createReducer } from "@reduxjs/toolkit";
// import { stat } from "fs";

// initial state

const initialState ={
    isAuthenticated:false,
}

export const userReducer = createReducer(initialState,{
    LoadUserRequest:(state)=>{
        state.loading = true;
    },
    LoadUserSuccess:(state,action)=>{
        state.isAuthenticated =true;
        // already loded in above condition
        state.loading = false;
        // current state me user ko load krdo
        state.user = action.payload;
    },
    LoadUserFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload
        state.isAuthenticated = false;
    },
    clearError:(state)=>{
        state.error = null;
    }

})