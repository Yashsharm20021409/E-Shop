import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  const handleHomePage =()=>{
    navigate("/");
    window.location.reload()
  }
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        {/* <Link to="/"> */}
          {/* <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt=""
          /> */}
          <h3 style={{ "fontWeight": "700", "fontSize": '30px' ,"color":'#1e5556'}} className="cursor-pointer" onClick={handleHomePage}>E-Shop.</h3>
        {/* </Link> */}
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
        {/* className="800px:block hidden" == className="max-md:hidden" sb jagah*/}
          <Link to="/dashboard/cupouns" className="max-md:hidden">
            <AiOutlineGift
              color = "#1e5556"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          {/* className="800px:block hidden" */}
          <Link to="/dashboard-events" className="max-md:hidden">
            <MdOutlineLocalOffer
              color = "#1e5556"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          {/* className="800px:block hidden" */}
          <Link to="/dashboard-products" className=" max-md:hidden" >
            <FiShoppingBag
              color = "#1e5556"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          {/* className="800px:block hidden" */}
          <Link to="/dashboard-orders" className="max-md:hidden">
            <FiPackage color = "#1e5556" size={30} className="mx-5 cursor-pointer" />
          </Link>
          {/* className="800px:block hidden" */}
          <Link to="/dashboard-messages" className="max-md:hidden">
            <BiMessageSquareDetail
              color = "#1e5556"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${backend_url}${seller.avatar}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;