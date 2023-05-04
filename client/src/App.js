import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage, ShopLoginPage, SignupPage, ActivationPage, SellerActivationPage, HomePage, ProductDetailsPage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProfilePage, CheckoutPage, PaymentPage, OrderSuccessPage, ShopCreatePage } from "./routes/RoutesLink"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from 'react';
// import axios from 'axios';
// import { server } from './server';
import Store from './redux/store';
import { loadSeller, loaduser } from './redux/actions/user';
import ProtectedRoute from "./routes/ProtectedRoute";
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import { ShopDashboardPage ,ShopCreateProduct,ShopAllProducts,ShopCreateEvents} from "./routes/ShopRoutes.js"
import {ShopHomePage} from "./shopRoutes"

function App() {

  // this is not the good practice to load the user because we have to load the user at multiple palaces so to do that we use redux here
  // useEffect(()=>{
  //   axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
  //     // console.log(res.data);
  //     toast.success(res.data.message);
  //   })
  //   .catch((err)=>{toast.error(err.response.data.message)});
  // },[])

  useEffect(() => {
    Store.dispatch(loaduser());
    Store.dispatch(loadSeller());
  }, []);

  return (
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
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order/success/:id" element={<OrderSuccessPage />} />
        {/* to avoid access profile page (if !isAuthenticted redirect user to navigate otherwise navigate to children(Profile page)) */}
        <Route path="/profile" element={
          <ProtectedRoute >
            <ProfilePage />
          </ProtectedRoute>} />

        {/* Shop Routes */}
        <Route path="/shop-create" element={<ShopCreatePage />}></Route>
        <Route path="/shop-login" element={<ShopLoginPage />}></Route>
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute >
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute >
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute >
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute >
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
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
  );
}

export default App;
