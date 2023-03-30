import './App.css';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import {LoginPage,SignupPage,ActivationPage,HomePage,ProductDetailsPage ,ProductsPage,BestSellingPage,EventsPage,FAQPage,} from "./RoutesLink.js"
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from 'react';
// import axios from 'axios';
// import { server } from './server';
import Store from './redux/store';
import { loaduser } from './redux/actions/user';
import { useSelector } from "react-redux";

function App() {

  // this is not the good practice to load the user because we have to load the user at multiple palaces so to do that we use redux here
  // useEffect(()=>{
  //   axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
  //     // console.log(res.data);
  //     toast.success(res.data.message);
  //   })
  //   .catch((err)=>{toast.error(err.response.data.message)});
  // },[])

  const { loading } = useSelector((state) => state.user);
  useEffect(()=>{
    Store.dispatch(loaduser());
  },[]);

  return (
    <>
    {loading ? null : (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} > </Route>
          <Route exact path='/login' element={<LoginPage />} > </Route>
          <Route exact path='/sign-up' element={<SignupPage />} > </Route>
          <Route exact path='/activation/:activation_token' element={<ActivationPage />} > </Route>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:name" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
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
    )}
    </>
  );
}

export default App;
