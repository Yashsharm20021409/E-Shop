import React from 'react'
import styles from '../../styles/style'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import { Link } from 'react-router-dom';

const ShopPreviewPage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5] flex max-md:flex-col`} style={{position:"relative"}}>
         <div className="w-full  py-10  flex  max-md:flex-col">
          <div className="w-[25%] bg-[#fff] rounded-[4px] shadow-sm max-md:overflow-y-scroll max-md:h-[90vh] max-md:w-full">
            <ShopInfo isOwner={false} />
          </div>
          <div className="w-[72%] mt-5 max-md:mt-['unset'] rounded-[4px] ml-5">
            <ShopProfileData isOwner={false} />
          </div>
         </div>
           </div>
  )
}

export default ShopPreviewPage