import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage, ShopLoginPage, SignupPage, ActivationPage, SellerActivationPage, HomePage, ProductDetailsPage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProfilePage, CheckoutPage, PaymentPage, OrderSuccessPage, ShopCreatePage ,OrderDetailsPage} from "./routes/RoutesLink"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from 'react';
import Store from './redux/store';
import { loadSeller, loaduser } from './redux/actions/user';
import ProtectedRoute from "./routes/ProtectedRoute";
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import { ShopDashboardPage, ShopCreateProduct, ShopAllProducts, ShopCreateEvents, ShopAllEvents, ShopAllCoupouns, ShopPreviewPage, ShopAllOrders, ShopOrderDetails } from "./routes/ShopRoutes.js"
import { ShopHomePage } from "./shopRoutes"
import { getAllProducts } from './redux/actions/product';
import { getAllEvents } from './redux/actions/event';
import axios from 'axios';
import { server } from './server';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {

  // this is not the good practice to load the user because we have to load the user at multiple palaces so to do that we use redux here
  // useEffect(()=>{
  //   axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
  //     // console.log(res.data);
  //     toast.success(res.data.message);
  //   })
  //   .catch((err)=>{toast.error(err.response.data.message)});
  // },[])

  const [stripeApikey, setStripeApiKey] = useState("");

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }
  // console.log(stripeApikey);

  useEffect(() => {
    Store.dispatch(loaduser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);


  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route path="/payment" element={<ProtectedRoute> <PaymentPage /> </ProtectedRoute>} />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path='/' element={<HomePage />} > </Route>
        <Route exact path='/login' element={<LoginPage />} > </Route>
        <Route exact path='/sign-up' element={<SignupPage />} > </Route>
        <Route path="/products" element={<ProductsPage />} />
        <Route exact path='/activation/:activation_token' element={<ActivationPage />} > </Route>
        <Route exact path='/seller/activation/:activation_token' element={<SellerActivationPage />} > </Route>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>} />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        {/* to avoid access profile page (if !isAuthenticted redirect user to navigate otherwise navigate to children(Profile page)) */}
        <Route path="/profile" element={
          <ProtectedRoute >
            <ProfilePage />
          </ProtectedRoute>} />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Shop Routes */}
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
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
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
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

        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-coupouns"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
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
