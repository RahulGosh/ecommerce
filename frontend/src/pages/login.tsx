import React, { useEffect, useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../store/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const AuthForm = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const navigate = useNavigate();

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginMutation();

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Registration successful!");
      setJustRegistered(true);
      // Clear form fields except email (to make login easier)
      setFormData(prev => ({
        name: "",
        email: prev.email, // Keep email for easier login
        password: "",
      }));
    }

    if (registerError) {
      const errorData = (registerError as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Registration failed. Please try again.");
    }

    if (loginError) {
      const errorData = (loginError as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Invalid credentials. Please try again.");
    }

    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful!");
      navigate("/");
    }
  }, [
    registerIsSuccess,
    loginIsSuccess,
    registerData,
    loginData,
    loginError,
    registerError,
    navigate,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === "register") {
      const { name, email, password } = formData;
      await registerUser({ name, email, password });
    } else {
      const { email, password } = formData;
      await loginUser({ email, password });
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setFormData(prev => ({
      name: "",
      email: authMode === "login" ? "" : prev.email, // Keep email if switching to login
      password: "",
    }));
    setJustRegistered(false);
  };

  const handleTabChange = (mode: "login" | "register") => {
    setAuthMode(mode);
    setJustRegistered(false);
    setFormData(prev => ({
      name: "",
      email: mode === "login" ? prev.email : "", // Keep email if switching to login
      password: "",
    }));
  };

  const isLoading = registerIsLoading || loginIsLoading;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden mt-14">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transform transition-all mx-4">
        {/* Form Header with Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
              authMode === "login"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("login")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
              authMode === "register"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("register")}
          >
            Sign Up
          </button>
        </div>

        {justRegistered && authMode === "login" && (
          <div className="bg-green-50 text-green-700 p-4 text-center text-sm">
            Registration successful! Please log in with your credentials.
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {authMode === "login" ? "Welcome back" : "Create an account"}
          </h2>

          {authMode === "register" && (
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="Full Name"
                required={authMode === "register"}
              />
            </div>
          )}

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Password"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {authMode === "login" && (
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                {authMode === "login" ? "Sign In" : "Sign Up"}
                <FiArrowRight className="ml-2" />
              </span>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 text-purple-600 font-medium hover:text-purple-800 focus:outline-none"
              >
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm6.25 10c0 3.452-2.798 6.25-6.25 6.25-3.452 0-6.25-2.798-6.25-6.25 0-3.452 2.798-6.25 6.25-6.25 3.452 0 6.25 2.798 6.25 6.25zm-6.25-4.167a4.167 4.167 0 100 8.334 4.167 4.167 0 000-8.334z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;