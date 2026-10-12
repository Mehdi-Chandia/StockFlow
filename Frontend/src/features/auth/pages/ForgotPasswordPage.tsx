import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ForgotPasswordData,
  forgotPasswordSchema,
} from "../schemas/authSchema";
import { Link } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/authService";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    // console.log(data);
    setIsLoading(true)
    try {
      const response= await forgotPassword(data.email);
      console.log(response);
      alert("If email exists reset link is sent!")

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error on forgot-password page ", error.response?.data);
        console.log(error);
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
        Enter your email account{" "}
      </h3>

      {/* card */}
      <div className="w-full max-w-md bg-[#1B1F23] border border-[#2A3036] rounded-xl p-6 shadow-lg">
        <p className=" text-[#F3F4F6] text-center mt-2 mb-2">
          {" "}
          we will send a reset link to your registered account
        </p>
        {/* forgot password form */}
        <form
          className="flex flex-col p-2 gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#0891B2] hover:bg-[#0E7490] disabled:cursor-not-allowed
            text-white font-medium py-3 rounded-lg
            transition-colors`}
          >
            Submit
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

export default ForgotPasswordPage;