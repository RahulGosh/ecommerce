import { useEffect } from "react";
import { assets } from "../assets/assets";
import { useLogoutMutation } from "../store/api/adminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [logoutUser, { data, isSuccess }] = useLogoutMutation();
  const navigate = useNavigate()

  const logoutHandler = async () => {
    await logoutUser(); // Logout mutation
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/add");
    }
  }, [isSuccess]);

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%, 80px)]" src={assets.logo} />
      <button onClick={logoutHandler} className="bg-gray-600 text-white px-5 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
