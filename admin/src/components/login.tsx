import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoginMutation } from "../store/api/adminApi";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const AdminLogin = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const navigate = useNavigate();

    const [
      loginAdmin,
      {
        data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess,
      },
    ] = useLoginMutation();
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLocked) {
            toast.error("Account temporarily locked. Try again later.");
            return;
        }

        try {
            await loginAdmin({ email, password }).unwrap();
        } catch (error) {
            console.error("Login Error:", error);
            setAttempts(prev => prev + 1);
            
            if (attempts >= 2) { // Lock after 3 failed attempts
                setIsLocked(true);
                setTimeout(() => setIsLocked(false), 300000); // 5 minute lock
                toast.error("Too many failed attempts. Account locked for 5 minutes.");
            }
        }
    };
  
    useEffect(() => {
        if (loginError) {
            const errorData = (loginError as FetchBaseQueryError)?.data as { message?: string };
            toast.error(
                <div className="flex items-center">
                    <FiAlertCircle className="mr-2" />
                    {errorData?.message || "Invalid credentials"}
                </div>
            );
        }
  
        if (loginIsSuccess && loginData) {
            toast.success(
                <div className="flex items-center">
                    <FiLock className="mr-2" />
                    {loginData.message || "Admin access granted"}
                </div>
            );
            navigate("/admin/dashboard");
        }
    }, [loginIsLoading, loginData, loginError, navigate]);
        
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4 overflow-hidden">
            <div className="bg-white shadow-lg rounded-xl px-8 py-8 max-w-md w-full border border-gray-200">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FiLock className="text-blue-600 text-2xl" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 text-sm">Restricted access to authorized personnel only</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-gray-400" />
                            </div>
                            <input
                                id="email"
                                className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLocked || loginIsLoading}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                            </div>
                            <input
                                id="password"
                                className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLocked || loginIsLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FiEyeOff className="text-gray-400 hover:text-gray-500" />
                                ) : (
                                    <FiEye className="text-gray-400 hover:text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLocked || loginIsLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                (isLocked || loginIsLoading) ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loginIsLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </>
                            ) : isLocked ? (
                                "Account Locked"
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>
                
                {attempts > 0 && (
                    <div className="mt-4 text-center text-sm text-yellow-600">
                        <FiAlertCircle className="inline mr-1" />
                        {3 - attempts > 0 
                            ? `${3 - attempts} attempts remaining`
                            : "Account locked for security"}
                    </div>
                )}
                
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Unauthorized access is prohibited and will be prosecuted</p>
                    <p className="mt-1">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;