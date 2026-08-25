import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllMovements } from "../controllers/stockMovement.controller.js";
const router= express.Router();


router.post("/get-all-movements", verifyToken, getAllMovements)

export default router;