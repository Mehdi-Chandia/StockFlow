import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { createWareHouse, getAllWareHouses, getWareHouse, updateWareHouse, updateWHstatus } from "../controllers/wareHouse.controller.js";
const router= express.Router();


router.post("/create", verifyToken, isAdmin, createWareHouse)
router.get("/all",verifyToken, isAdmin, getAllWareHouses)
router.get("/:wareHouseId", verifyToken, isAdmin, getWareHouse)
router.patch("/:wareHouseId/status", verifyToken, isAdmin, updateWHstatus)
router.patch("/:wareHouseId/update", verifyToken, isAdmin, updateWareHouse)

export default router;