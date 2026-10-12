import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { changePassword, createUser, forgotPassword, getUser, loginUser, logout, refreshToken, resendOTP, resetPassword, verifyOTP } from "../controllers/user.controller.js";
import { loginRateLimiter, otpRateLimiter, resetPasswordRateLimiter } from "../middlewares/rateLimit.middleware.js";
const router= express();

// router.use(verifyToken)

router.post("/create",verifyToken, isAdmin, createUser)
router.post("/login", loginRateLimiter, loginUser)
router.post("/verify-otp", otpRateLimiter, verifyOTP)
router.post("/resend-otp", otpRateLimiter, resendOTP )
router.post("/forgot-password", resetPasswordRateLimiter ,forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/refresh",verifyToken, refreshToken)
router.get("/logout", verifyToken, logout);
router.post("/change-password", changePassword)
router.get("/profile", verifyToken, getUser)


export default router;