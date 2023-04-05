import React, {  useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/style";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header />
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
        <div className="w-[215px] 800px:w-[335px] sticky 800px:mt-0 max-md:w-[65px]">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;