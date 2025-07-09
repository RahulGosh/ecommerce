import { motion } from "framer-motion";
import { useState, useContext, useRef, useEffect } from "react";
import { useGetUserCartQuery } from "../store/api/cartApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { SearchContext } from "../context/searchContext";
import { User } from "../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/authApi";
import { userLoggedOut } from "../store/slices/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: cartData } = useGetUserCartQuery();
  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Add logout mutation
  const [logout] = useLogoutMutation();

  // Access the SearchContext
  const searchContext = useContext(SearchContext);
  if (!searchContext) {
    throw new Error(
      "SearchContext must be used within a SearchContextProvider"
    );
  }
  const { setShowSearch } = searchContext;

  const cartItemCounts = cartData?.cart?.items?.length || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(userLoggedOut());
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.nav
      className="bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 w-full z-50 shadow-sm sticky top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button - only visible on small screens */}
          <motion.button
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </motion.button>

          {/* Logo */}
          <Link to="/">
            <motion.div
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              STYLEHUB
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link to="/">
            <motion.div
              className="text-gray-700 hover:text-indigo-600 relative font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Home
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
          <Link to="/collection">
            <motion.div
              className="text-gray-700 hover:text-indigo-600 relative font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Collections
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Search button - triggers search modal */}
          <motion.button
            className="p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>

          {/* Cart with item count */}
          <motion.button
            className="p-2 relative text-gray-600 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/cart");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartItemCounts > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {cartItemCounts}
              </motion.span>
            )}
          </motion.button>

          {/* User profile or login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-medium"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </motion.button>
              
              {/* Dropdown menu - no longer using hover, but click to toggle */}
              {dropdownOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <motion.div
                className="hidden sm:block px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
                whileHover={{ scale: 1.05 }}
              >
                Login
              </motion.div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: menuOpen ? "auto" : 0,
          opacity: menuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="pt-4 pb-2 space-y-2">
          <Link to="/">
            <motion.div
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
              whileHover={{ x: 5 }}
            >
              Home
            </motion.div>
          </Link>
          <Link to="/collection">
            <motion.div
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
              whileHover={{ x: 5 }}
            >
              Collections
            </motion.div>
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <motion.div
                className="block px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
                whileHover={{ x: 5 }}
              >
                Login
              </motion.div>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;