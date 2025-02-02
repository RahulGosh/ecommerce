import React, { useEffect, useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../store/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      toast.success(registerData.message || "Registered Successfully");
      navigate("/");
    }

    if (registerError) {
      const errorData = (registerError as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Registration Failed");
    }

    if (loginError) {
      const errorData = (loginError as FetchBaseQueryError)?.data as { message?: string };
      toast.error(errorData?.message || "Login Failed");
    }

    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Logged In Successfully");
      navigate("/");
    }
  }, [
    registerIsLoading,
    loginIsLoading,
    registerData,
    loginData,
    loginError,
    registerError,
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

    if (currentState === "Sign Up") {
      const { name, email, password } = formData;
      await registerUser({ name, email, password });
    } else {
      const { email, password } = formData;
      await loginUser({ email, password });
    }
  };

  const isLoading = registerIsLoading || loginIsLoading;  // Combined loading state for both login and register

  return (
    <form
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      onSubmit={handleSubmit}
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] wo-8 bg-gray-800" />
      </div>

      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
        />
      )}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>

        {currentState === "Login" ? (
          <p className="cursor-pointer" onClick={() => setCurrentState("Sign Up")}>
            Create account
          </p>
        ) : (
          <p className="cursor-pointer" onClick={() => setCurrentState("Login")}>
            Login here
          </p>
        )}
      </div>

      <button
        className={`bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;