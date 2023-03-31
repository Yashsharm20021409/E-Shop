import React, { useEffect } from 'react'
import Login from "../components/Login/Login.jsx"
import {useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state) => state.user)

  // to stop reaching out the login page again till we logged in
  useEffect(()=>{
    if(isAuthenticated === true){
      navigate("/")
    }
  })
  return (
    <div className='w-full h-screen bg-gray-50'>
      <Login />
    </div>
  )
}

export default LoginPage
