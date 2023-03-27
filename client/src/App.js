import './App.css';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import {LoginPage,SignupPage} from "./RoutesLink.js"

import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/login' element={<LoginPage />} > </Route>
          <Route exact path='/sign-up' element={<SignupPage />} > </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
