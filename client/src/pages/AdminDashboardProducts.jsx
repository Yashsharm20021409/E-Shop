import React from 'react'
import AdminHeader from '../components/Admin/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllProducts from "../components/Admin/AllProducts";

const AdminDashboardProducts = () => {
  return (
    <div>
    <AdminHeader />
    <div className="w-full flex">
      <div className="flex items-start justify-between w-full">
        <div className="max-md:w-[80px] w-[330px]">
          <AdminSideBar active={5} />
        </div>
        <AllProducts />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardProducts