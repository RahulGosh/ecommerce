import React, { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../store/api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { data, error, isSuccess, isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    }
    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Something went wrong");
    }
  }, [data, error, isSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error("Please fill all fields.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    await resetPassword({ token: token || "", password });
  };

  return (
    <form
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold">Reset Password</h2>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter new password"
      />
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Confirm new password"
      />
      <button
        className={`bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
