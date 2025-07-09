import React, { useState, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiBell, FiSettings } from "react-icons/fi";
import { useLogoutMutation } from "../store/api/adminApi";

interface NavItemProps {
  to: string;
  label: string;
  icon: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  const icons: Record<string, ReactNode> = {
    plus: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    ),
    grid: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
      </svg>
    ),
    package: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    ),
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `grid grid-cols-[auto_1fr] items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-600 hover:bg-blue-50"
        }`
      }
    >
      <div>{icons[icon]}</div>
      <span>{label}</span>
    </NavLink>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [logoutUser] = useLogoutMutation();

  const logoutHandler = async () => {
    await logoutUser(); // Logout mutation
  };

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-gray-100 gap-4 p-4">
      {/* Sidebar with rounded corners */}
      <div 
        className={`z-30 bg-white rounded-2xl shadow-lg w-64 overflow-hidden ${
          isSidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        {/* Navigation */}
        <div className="grid grid-rows-[auto_1fr_auto] h-full p-4 gap-2">
          <div className="mb-6 pt-3">
            <div className="grid grid-cols-[auto_1fr] items-center p-3 bg-blue-50 rounded-xl mb-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 grid place-items-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <p className="text-gray-800 font-medium">Admin User</p>
                <p className="text-gray-500 text-sm">Administrator</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 space-y-2">
            <NavItem to="/add" label="Add Products" icon="plus" />
            <NavItem to="/list" label="Product List" icon="grid" />
            <NavItem to="/orders" label="Manage Orders" icon="package" />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={logoutHandler}
              className="flex items-center w-full p-3 text-gray-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-rows-[auto_1fr] gap-6 overflow-x-hidden overflow-y-auto">
        {/* Top Bar with rounded corners */}
        <div className="sticky top-4 z-20 bg-white rounded-2xl shadow-lg">
          <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto] items-center px-6 py-4 gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="md:col-start-1 md:col-end-2">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>
            
            <div className="grid grid-flow-col gap-4 items-center">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                <FiSettings className="w-5 h-5" />
              </button>
              
              <div className="hidden md:grid grid-cols-[auto_auto] items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 grid place-items-center text-white font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Admin</span>
              </div>

              <button
                onClick={logoutHandler}
                className="grid grid-cols-[auto_auto] items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Container with rounded corners */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;