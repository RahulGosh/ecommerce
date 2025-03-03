import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoginMutation } from "../store/api/adminApi";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => { 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await loginAdmin({ email, password }).unwrap();
        } catch (error) {
          console.error("Login Error:", error);
        }
      };
  
    const [
      loginAdmin,
      {
        data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess,
      },
    ] = useLoginMutation();
  
    useEffect(() => {
      if (loginError) {
        const errorData = (loginError as FetchBaseQueryError)?.data as { message?: string };
        toast.error(errorData?.message || "Login Failed");
      }
  
      if (loginIsSuccess && loginData) {
        toast.success(loginData.message || "Logged In Successfully");
        navigate("/add");
      }
    }, [
      loginIsLoading,
      loginData,
      loginError,
    ]);
        
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
