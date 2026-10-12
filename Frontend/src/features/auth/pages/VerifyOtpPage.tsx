import { otpSchema, type OtpCode } from "../schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";
import { resendOTP, verifyOTP } from "../services/authService";

const VerifyOtpPage = () => {
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const email = location.state?.email;
  const navigateTo= useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpCode>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpCode) => {
    console.log(data);
    try {
      setIsLoading(true);

      const response = await verifyOTP({ email: email, otp: data.otpCode });
      navigateTo("/dashboard")
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error on otp page ", error.response?.data);
        alert(error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // resend OTP
 async function handleResend() {
    setCanResend(false);
    setCountdown(60);
    // the api call
    try {
      await resendOTP(email)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error otp page in resend function", error.response?.data);
        console.log(error.response);
        
        alert(error.response?.data?.message); 
      }
    }
  }

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      setCountdown(0);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111315] px-4 gap-4">
      {/* header */}
      <h3 className="text-[#22D3EE] text-2xl font-bold">Verify Your Account</h3>
      {/* OTP verify card */}
      <div className="w-full max-w-md bg-[#1B1F23] border border-[#2A3036] rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <p className="text-[#F3F4F6]">Enter the 6 digits code</p>
          <p className="text-[#F3F4F6]">sent to your email</p>
        </div>
        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-2"
        >
          {/* otp code */}
          <div className="flex flex-col gap-2">
            <label className="text-[#CBD5E1] text-sm">OTP Code</label>

            <input
              {...register("otpCode")}
              type="text"
              inputMode="numeric"
              placeholder="Enter the 6 digit code"
              className="w-full bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />
            {errors.otpCode && (
              <p className="text-red-400 text-xs"> {errors.otpCode.message} </p>
            )}
          </div>
          <button
            disabled={isLoading || !canResend}
            type="submit"
            className={`w-full bg-[#0891B2] hover:bg-[#0E7490]
            text-white font-medium py-3 rounded-lg
            transition-colors disabled:cursor-not-allowed `}
          >
            {isLoading ? "verifying..." : "Verify OTP"}
          </button>
          <Link to={"/login"} className="text-gray-400 text-sm hover:text-blue-400">
            {" "}
            ← Back to Login
          </Link>
        </form>
        <div className="text-center">
          <button
            onClick={handleResend}
            className=" text-[#71717A] hover:text-[#F3F4F6] "
          >
            {canResend ? "Resend OTP" : `can resend in ${countdown}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
