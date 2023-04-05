import React from "react";
import {
  AiOutlineCreditCard,
  AiOutlineLogin,
  AiOutlineMessage,
} from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
// import  form "react-router-dom";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  // const {isAuthenticated} = useSelector((state)=>state.user);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const logoutHandler = (e) => {
    e.preventDefault();
    axios.get(`${server}/user/logout`,{ withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        // used before navigate otherwise you back click back page arrow again you see you are still logged in
        window.location.reload(true)
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "red" : ""} />
        <span className={`pl-3 ${active === 1 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
        <span className={`pl-3 ${active === 2 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Orders
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
        <span className={`pl-3 ${active === 3 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Refunds
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
        <span className={`pl-3 ${active === 4 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Inbox
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
        <span className={`pl-3 ${active === 5 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Track Order
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <AiOutlineCreditCard size={20} color={active === 6 ? "red" : ""} />
        <span className={`pl-3 ${active === 6 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Payment Methods
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
        <span className={`pl-3 ${active === 7 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Address
        </span>
      </div>

      {/* to avoid unnecessary click on logout button */}
      {isAuthenticated ? <div
        className="single_item flex items-center cursor-pointer w-full mb-8" 
        onClick={ logoutHandler}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
        <span className={`pl-3 ${active === 8 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
          Log out
        </span>
      </div> : 
      <div
      className="single_item flex items-center cursor-pointer w-full mb-8" 
      onClick={ logoutHandler} style={{"pointerEvents":"none"}}
    >
      <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
      <span className={`pl-3 ${active === 8 ? "text-[red]" : ""} 800px:block max-md:hidden`}>
        Log out
      </span>
    </div>
      }
    </div>
  );
};

export default ProfileSidebar;