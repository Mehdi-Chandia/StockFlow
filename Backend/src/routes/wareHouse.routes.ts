import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import { createWareHouse, getAllWareHouses, getWareHouse, updateWareHouse, updateWHstatus } from "../controllers/wareHouse.controller.js";
const router= express.Router();


router.post("/create", verifyToken, createWareHouse)
router.get("/all",verifyToken, getAllWareHouses)
router.get("/:wareHouseId", verifyToken, getWareHouse)
router.patch("/:wareHouseId/status", verifyToken, updateWHstatus)
router.patch("/:wareHouseId/update", verifyToken, updateWareHouse)

export default router;