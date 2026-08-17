import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { changePassword, createUser, forgotPassword, loginUser, logout, refreshToken, resetPassword, verifyOTP } from "../controllers/user.controller.js";
const router= express();

router.post("/create",verifyToken,isAdmin,createUser)
router.post("/login",loginUser)
router.post("/verify-otp", verifyOTP)
router.post("/forgot-password",verifyToken,forgotPassword)
router.post("/reset-password/:token", verifyToken, resetPassword)
router.post("/refresh", refreshToken)
router.get("/logout", verifyToken, logout);
router.post("/change-password",verifyToken,changePassword)


export default router;