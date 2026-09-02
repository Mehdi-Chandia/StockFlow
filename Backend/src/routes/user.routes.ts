import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { changePassword, createUser, forgotPassword, loginUser, logout, refreshToken, resetPassword, verifyOTP } from "../controllers/user.controller.js";
import { loginRateLimiter, otpRateLimiter, resetPasswordRateLimiter } from "../middlewares/rateLimit.middleware.js";
const router= express();

router.use(verifyToken)

router.post("/create",isAdmin,createUser)
router.post("/login", loginRateLimiter, loginUser)
router.post("/verify-otp", otpRateLimiter, verifyOTP)
router.post("/forgot-password",resetPasswordRateLimiter,forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/refresh", refreshToken)
router.get("/logout", logout);
router.post("/change-password",changePassword)


export default router;