import React, { useState, useEffect } from "react";
import { useForgotPasswordMutation } from "../store/api/authApi";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [forgotPassword, { data, error, isLoading, isSuccess }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "Password reset link sent successfully.");
      navigate("/login");
    }

    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Failed to send reset link.");
    }
  }, [isSuccess, data, error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword({ email });
  };

  return (
    <form
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      onSubmit={handleSubmit}
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Forgot Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter your email"
        required
      />

      <button
        className={`bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPassword;
