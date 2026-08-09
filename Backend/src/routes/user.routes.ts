import express from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { createUser, forgotPassword, loginUser, resetPassword, verifyOTP } from "../controllers/user.controller.js";
const router= express();

router.post("/create",verifyToken,isAdmin,createUser)
router.post("/login",loginUser)
router.post("/verify-otp", verifyOTP)
router.post("/forgot-password",verifyToken,forgotPassword)
router.post("/reset-password/:token", verifyToken, resetPassword)

export default router;