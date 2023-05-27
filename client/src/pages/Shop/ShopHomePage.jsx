import React from 'react'
import styles from '../../styles/style'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
         <div className="w-full flex py-10 justify-between max-md:flex-col">
          <div className="w-[25%] max-md:w-full bg-[#fff] rounded-[4px] shadow-sm overflow-y-scroll h-[90vh] sticky top-10 left-0 z-10 max-md:top-0 max-md:z-0 max-md:relative">
            <ShopInfo isOwner={true} />
          </div>
          <div className="w-[72%] max-md:w-full max-md:mt-10 rounded-[4px]">
            <ShopProfileData isOwner={true} />
          </div>
         </div>
    </div>
  )
}

export default ShopHomePage