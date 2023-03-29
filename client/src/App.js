import './App.css';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import {LoginPage,SignupPage,ActivationPage} from "./RoutesLink.js"
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from 'react';
// import axios from 'axios';
// import { server } from './server';
import Store from './redux/store';
import { loaduser } from './redux/actions/user';

function App() {

  // this is not the good practice to load the user because we have to load the user at multiple palaces so to do that we use redux here
  // useEffect(()=>{
  //   axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
  //     // console.log(res.data);
  //     toast.success(res.data.message);
  //   })
  //   .catch((err)=>{toast.error(err.response.data.message)});
  // },[])

  useEffect(()=>{
    Store.dispatch(loaduser());
  },[]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} > </Route>
          <Route path='/sign-up' element={<SignupPage />} > </Route>
          <Route path='/activation/:activation_token' element={<ActivationPage />} > </Route>
        </Routes>
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
      </BrowserRouter>
    </div>
  );
}

export default App;
