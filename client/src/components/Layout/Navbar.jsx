import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/style'

const Navbar = ({active}) => {
  return (
    <div className={`block 800px:${styles.normalFlex} flex`}>
         {
            // same if any navbar ele exists then map it and create seprate div for every navelement
            // i = ele index = index of array
            navItems && navItems.map((i,index) => (
                <div className="flex" key={index}>
                  {/* url also exists in dummy data */}
                    <Link to={i.url} className={`${active === index + 1 ? "text-teal-400" : "text-white 800px:text-[#fff]"} pb-[4px] 800px:pb-0 font-[500] px-6 cursor-pointer}`}>
                    {i.title}
                    </Link>
                </div>
            ))
         }
    </div>
  )
}

export default Navbar