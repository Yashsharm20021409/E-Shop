import React,{useEffect} from 'react'
import ShopLogin from "../components/Shop/ShopLogin.jsx";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller,isLoading,seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/shop/${seller._id}`);
    }
  }, [isLoading,isSeller])

  return (
    <div>
        <ShopLogin />
    </div>
  )
}

export default ShopLoginPage