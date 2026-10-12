import { Layers, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";
import { useState } from "react";
import { loginUser } from "../services/authService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const[isLoading, setIsLoading]=useState(false);

  const navigate=useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit =async (data: LoginFormData) => {
    try {
      setIsLoading(true)

     const response=await loginUser(data);
     console.log(response);
     
     navigate("/verify-otp",{
      state:{
        email: data.email
      }
     })

    } catch (error) {
      // console.log("erros of login page ",error);
       if (axios.isAxiosError(error)) {
    //  console.log("Status:", error.response?.status);
     console.log("Response:", error.response?.data);
     alert(error.response?.data);
       }
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111315] px-4">
      {/* Logo */}
      <div className="flex gap-2 items-center mb-8">
        <Layers size={22} className="text-[#22D3EE]" />

        <h3 className="text-[#22D3EE] text-2xl font-bold">
          <span className="text-white">Stock</span> Flow
        </h3>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1B1F23] border border-[#2A3036] rounded-xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h4 className="text-[#F3F4F6] text-2xl font-semibold">
            Welcome Back!
          </h4>

          <p className="text-[#71717A] text-sm mt-2">
            Sign in to continue to StockFlow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[#CBD5E1] text-sm">Email</label>

            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />
            {errors.email && (
              <p className="text-red-400 text-xs"> {errors.email.message} </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#CBD5E1] text-sm">Password</label>

            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full relative bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2/3 -translate-y-1/2 text-[#71717A] hover:text-[#F3F4F6]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs"> {errors.password.message} </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
            onClick={()=> navigate("/forgot-password")}
              type="button"
              className="text-sm text-[#22D3EE] hover:text-[#67E8F9]"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
          disabled={isLoading}
            type="submit"
            className="w-full bg-[#0891B2] hover:bg-[#0E7490] disabled:cursor-not-allowed
            text-white font-medium py-3 rounded-lg
            transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-[#52525B] text-xs mt-6">
        © 2026 StockFlow. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
