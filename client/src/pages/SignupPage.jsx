import React,{useEffect} from 'react'
import Signup from "../components/Signup/Signup.jsx"
import {useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state) => state.user)

  // to stop reaching out the sigup page again till we logged in
  useEffect(()=>{

    if(isAuthenticated === true){
      navigate("/")
    }
  })
  return (
    <div>
      <Signup/>
    </div>
  )
}

export default SignupPage
