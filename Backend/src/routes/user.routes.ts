import express from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { createUser, loginUser, verifyOTP } from "../controllers/user.controller.js";
const router= express();

router.post("/create",verifyToken,isAdmin,createUser)
router.post("/login",loginUser)
router.post("/verify-otp", verifyOTP)

export default router;