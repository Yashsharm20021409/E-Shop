import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

const ShopDashboardPage = () => {
  return (
        <div>
          <DashboardHeader />
          <div className="flex items-center justify-between w-full">
            <div className="w-[330px] max-md:w-[80px]">
              <DashboardSideBar active={1} />
            </div>
          </div>
          {/* dashboardPage */}
        </div>
  );
};

export default ShopDashboardPage;