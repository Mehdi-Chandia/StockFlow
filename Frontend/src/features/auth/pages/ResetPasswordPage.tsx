import {
  resetPasswordSchema,
  type ResetPasswordData,
} from "../schemas/authSchema";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import axios from "axios";

const ResetPasswordPage = () => {
  const {token}=useParams();

  console.log("reset password token ", token);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]= useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit =async (data: ResetPasswordData) => {
    // console.log(data);
    setIsLoading(true)
    if (data.newPassword !== data.confirmPassword) {
      alert("password must match")
      setIsLoading(false)
      return;
    }
    try {
      if (!token) {
       alert("Invalid or missing reset token");
       return;
     }
      const response= await resetPassword(data, token)
      console.log(response?.data);
      alert("Password reset successfully!")
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        alert(error.response?.data?.message); 
      }
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 justify-center items-center p-4">
      {/* header */}

      <h3 className="text-[#22D3EE] text-2xl font-bold">
        Reset Your Password{" "}
      </h3>

      {/* card */}
      <div className="w-full max-w-md bg-[#1B1F23] border border-[#2A3036] rounded-xl p-6 shadow-lg">
        <p className=" text-[#F3F4F6] text-center mt-2 mb-2">
          {" "}
          Create a new password
        </p>
        {/* forgot password form */}
        <form
          className="flex flex-col p-2 gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Password */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#CBD5E1] text-sm">Password</label>

            <input
              {...register("newPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
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
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.newPassword && (
              <p className="text-red-400 text-xs">
                {" "}
                {errors.newPassword.message}{" "}
              </p>
            )}
          </div>

          {/* confirm Password */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#CBD5E1] text-sm">Confirm Password</label>

            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="confirm your password"
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
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs">
                {" "}
                {errors.confirmPassword.message}{" "}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#0891B2] hover:bg-[#0E7490]
            text-white font-medium py-3 rounded-lg disabled:cursor-not-allowed
            transition-colors`}
          >
            {isLoading ? 'Resetting' : 'Reset'}
          </button>
        </form>
        <Link
          to={"/login"}
          className="text-gray-400 text-sm hover:text-blue-400 mt-4"
        >
          {" "}
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
