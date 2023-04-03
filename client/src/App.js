import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { LoginPage, ShopLoginPage, SignupPage, ActivationPage, SellerActivationPage, HomePage, ProductDetailsPage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProfilePage, CheckoutPage, PaymentPage, OrderSuccessPage, ShopCreatePage } from "./RoutesLink.js"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from 'react';
// import axios from 'axios';
// import { server } from './server';
import Store from './redux/store';
import { loadSeller, loaduser } from './redux/actions/user';
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import SellerProtectedRoute from "./SellerProtectedRoute"
// import { Navigate } from 'react-router-dom';
// import {  useNavigate } from "react-router-dom";

import {ShopHomePage} from "./ShopRoutes.js"

function App() {

  // this is not the good practice to load the user because we have to load the user at multiple palaces so to do that we use redux here
  // useEffect(()=>{
  //   axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
  //     // console.log(res.data);
  //     toast.success(res.data.message);
  //   })
  //   .catch((err)=>{toast.error(err.response.data.message)});
  // },[])

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { isSeller, seller, isLoading } = useSelector((state) => state.seller);
  // const navigate = useNavigate();
  useEffect(() => {
    Store.dispatch(loaduser());
    Store.dispatch(loadSeller());

  }, []);

  return (
    <>
      {loading || isLoading ? null : (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} > </Route>
            <Route exact path='/login' element={<LoginPage />} > </Route>
            <Route exact path='/sign-up' element={<SignupPage />} > </Route>
            <Route path="/products" element={<ProductsPage />} />
            <Route exact path='/activation/:activation_token' element={<ActivationPage />} > </Route>
            <Route exact path='/seller/activation/:activation_token' element={<SellerActivationPage />} > </Route>
            <Route path="/product/:name" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order/success/:id" element={<OrderSuccessPage />} />
            {/* to avoid access profile page (if !isAuthenticted redirect user to navigate otherwise navigate to children(Profile page)) */}
            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <ProfilePage /> </ProtectedRoute>} />
            <Route path="/shop-create" element={<ShopCreatePage />}></Route>
            <Route path="/shop-login" element={<ShopLoginPage />}></Route>
            <Route
              path="/shop/:id"
              element={
                <SellerProtectedRoute isSeller={isSeller} seller={seller}> 
                  <ShopHomePage />
                </SellerProtectedRoute>
              }
            />
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
