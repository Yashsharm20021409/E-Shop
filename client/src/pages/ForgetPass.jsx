import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/style";
import { server } from "../server";

const ForgetPass = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // console.log()
  
    const passwordChangeHandler = async (e) => {
      e.preventDefault();
  
      await axios
        .put(
          `${server}/shop/update-seller-password`,
          { oldPassword, newPassword, confirmPassword },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res.data.success);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          setOldPassword("");
          toast.error(error.response.data.message);
        });
    };
    return (
      <div className="w-full px-5">
        <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
          Change Password
        </h1>
        <div className="w-full">
          <form
            aria-required
            onSubmit={passwordChangeHandler}
            className="flex flex-col items-center"
          >
            <div className=" max-md:w-[100%] w-[50%] mt-5">
              <label className="block pb-2">Enter your old password</label>
              <input
                type="password"
                className={`${styles.input} !w-[95%] max-md:mb-4 mb-0`}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className=" max-md:w-[100%] w-[50%] mt-2">
              <label className="block pb-2">Enter your new password</label>
              <input
                type="password"
                className={`${styles.input} !w-[95%] max-md:mb-4 mb-0`}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className=" max-md:w-[100%] w-[50%] mt-2">
              <label className="block pb-2">Enter your confirm password</label>
              <input
                type="password"
                className={`${styles.input} !w-[95%] max-md:mb-4 mb-0`}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <input
                className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default ForgetPass;