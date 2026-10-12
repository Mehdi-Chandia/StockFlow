import type { Params } from "react-router-dom";
import api from "../../../services/api"
import type { LoginFormData, OtpCode, ResetPasswordData } from "../schemas/authSchema"

// login handler
export const loginUser=async(data: LoginFormData)=>{
    const response= await api.post("/auth/login", data)

    console.log(response);
    return response?.data;
}

// verify otp handler
export const verifyOTP=async (data:{email: string, otp: string})=>{
    console.log('data receiving on service page ',data);
    
    const response= await api.post("/auth/verify-otp", data)

    return response.data;
}

// resend otp handler
export const resendOTP= async(email: string)=>{
    const response= await api.post("/auth/resend-otp", email)

    return response?.data;
}

// forgot password handler
export const forgotPassword= async(email: string)=>{
    const response= await api.post("/auth/forgot-password", {email})

    return response?.data;
}

// reset password handler
export const resetPassword= async(data: ResetPasswordData, token: string)=>{
    console.log("token on service page ", token);
    
    const response= await api.post(`/auth/reset-password/${token}`, data);

    return response.data;
}

// get user
export const getUser= async ()=>{
    const response= await api.get("/auth/profile")

    return response.data;
}