import express from "express"
import { adjustInventory, createInventory, getInventory, inventoryOfProduct, inventoryOfWarehouse, updateInventoryStatus, updateReorderLevel } from "../controllers/inventory.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
const router= express.Router()


router.post("/create", verifyToken, createInventory)
router.get("/:inventoryId", verifyToken, getInventory)
router.get("/:warehouseId/warehouse", verifyToken, inventoryOfWarehouse)
router.get("/:productId/product", verifyToken, inventoryOfProduct)
router.patch("/:inventoryid/update/reorderlevel", verifyToken, updateReorderLevel)
router.patch("/:inventoryId/update/status", verifyToken, updateInventoryStatus)
router.patch("/:inventoryId/adjust", verifyToken, adjustInventory)


export default router;