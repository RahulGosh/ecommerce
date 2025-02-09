import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import search_icon from "../assets/search_icon.png";
import profile_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.png";
import menu_icon from "../assets/menu_icon.png";
import dropdown_icon from "../assets/dropdown_icon.png";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/searchContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useLogoutMutation } from "../store/api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGetUserCartQuery } from "../store/api/cartApi";
import { User } from "../types/types";
import { userLoggedOut } from "../store/slices/authSlice";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [logoutUser, { data, isSuccess }] = useLogoutMutation();
  const { data: cartData } = useGetUserCartQuery();
  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };

  console.log(cartData, "cartData");
  const dispatch = useDispatch()

  const cartItemCounts = cartData?.cart?.items?.length || 0;

  console.log(cartItemCounts, "cartItemCount");
  const logoutHandler = async () => {
    await logoutUser(); // Logout mutation
    dispatch(userLoggedOut())
  };

  const context = useContext(SearchContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error(
      "SearchContext must be used within a SearchContextProvider"
    );
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  const { setShowSearch } = context;

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Collection</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <img
          onClick={() => setShowSearch(true)}
          src={search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />

        <div className="group relative">
          <img className="w-5 cursor-pointer" src={profile_icon} alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              {user ? (
                <div>
                  <p
                    onClick={logoutHandler}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              ) : (
                <div>
                  <Link to="/login">
                    <p className="cursor-pointer hover:text-black">Login</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img src={cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 h-4 text-center leading-[16px] bg-black text-white rounded-full text-[8px]">
            {cartItemCounts}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Sidebar menu for small screen */}

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={dropdown_icon} alt="" className="h-4 rotate-180" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
