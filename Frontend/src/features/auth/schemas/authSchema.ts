import { z } from "zod";

// login validation schema
export const loginSchema=z.object({
    email: z.string().email("please enter a valid email"),
    password: z.string().min(8, "password must be atleast 8 characters")
})

export type LoginFormData=z.infer<typeof loginSchema>

// otp validation schema
export const otpSchema=z.object({
     otpCode: z
    .string()
    // .length(6, "OTP must be exactly 6 digits")
    // .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type OtpCode=z.infer<typeof otpSchema>

// forgot password validation schema
export const forgotPasswordSchema=z.object({
    email: z.string().email("please enter a valid email"),
})

export type ForgotPasswordData=z.infer<typeof forgotPasswordSchema>

// reset password validation schema 
export const resetPasswordSchema=z.object({
    newPassword: z.string().min(8, "password must be atleast 8 characters"),
    confirmPassword: z.string().min(8, "password must be atleast 8 characters") 
})

export type ResetPasswordData= z.infer<typeof resetPasswordSchema>
