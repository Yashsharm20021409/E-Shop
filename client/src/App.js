import './App.css';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import {LoginPage,SignupPage,ActivationPage} from "./RoutesLink.js"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from 'react';

function App() {
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
