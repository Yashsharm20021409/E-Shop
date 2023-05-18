import React from 'react'
import styles from '../../styles/style'

const CheckoutSteps = ({active}) => {
    console.log(active);
  return (
    <div className='w-full flex justify-center '>
        <div className="max-md:w-[100%] w-[50%] flex items-center flex-wrap ">
               <div className={`${styles.normalFlex}`}>
                <div className={`${styles.cart_button} max-md:h-[28px] max-md:w-[70px]`}>
                       <span className={`${styles.cart_button_text} max-md:text-xs`} >1.Shipping</span>
                </div>
                <div className={`${
                    active > 1 ? "max-md:w-[8px] w-[70px] h-[4px] !bg-[#f63b60]"
                    : "max-md:w-[8px] w-[70px] h-[4px] !bg-[#FDE1E6]"
                }`} />
               </div>

               <div className={`${styles.normalFlex}`}>
                <div className={`${active > 1 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#FDE1E6] max-md:h-[28px] max-md:w-[70px]`}`}>
                    <span className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#f63b60] max-md:text-xs`}`}>
                        2.Payment
                    </span>
                </div>
               </div>

               <div className={`${styles.normalFlex}`}>
               <div className={`${
                    active > 3 ? "max-md:w-[8px] w-[70px] h-[4px] !bg-[#f63b60]"
                    : "max-md:w-[8px] w-[70px] h-[4px] !bg-[#FDE1E6]"
                }`} />
                <div className={`${active > 2 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#FDE1E6] max-md:h-[28px] max-md:w-[70px]`}`}>
                    <span className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#f63b60] max-md:text-xs`}`}>
                        3.Success
                    </span>
                </div>
               </div>
        </div>
    </div>
  )
}

export default CheckoutSteps